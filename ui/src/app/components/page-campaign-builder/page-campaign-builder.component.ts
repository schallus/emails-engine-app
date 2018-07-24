import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { DOCUMENT } from '@angular/platform-browser';

// Environment variables
import { environment } from '../../../environments/environment';

// Services
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiService } from '../../services/api.service';

// Models
import { Block } from './../../models/block';
import { BlockPosition } from '../../models/block-position';
import { Campaign } from '../../models/campaign';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-page-campaign-builder',
  templateUrl: './page-campaign-builder.component.html',
  styleUrls: ['./page-campaign-builder.component.scss']
})
export class PageCampaignBuilderComponent implements OnInit {

  @ViewChild('modalBlockRemove') public modalBlockRemove;
  @ViewChild('modalPreviewEmails') public modalPreviewEmails;
  @ViewChild('modalExportEmails') public modalExportEmails;
  @ViewChild('dragNDropBlocksList') dragNDropBlocksList: any;


  // Url parameters
  brand: Brand;
  campaign: Campaign;

  // Liste des blocs
  blocks: Block[];
  categorizedBlocks: any;

  // Options de la campagne
  campaignStructure: BlockPosition[];
  campaignOptions: any;
  campaignLanguages: string[];

  // Drag n drop options
  blockLibraryOptions: SortablejsOptions;
  dropZoneOptions: SortablejsOptions;

  block: BlockPosition;
  blockData: any;

  blocksFixed: boolean;

  previewLinks: Array<{url: string, lang: string}>;
  buildInProgress: boolean;

  serverUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    @Inject(DOCUMENT) private doc: Document,
    private toastrService: ToastService
  ) {
    this.blocksFixed = false;
    this.buildInProgress = false;
    this.serverUrl = environment.serverUrl;

    this.blockLibraryOptions = {
      group: {
        name: 'group1',
        pull: 'clone',
        put: false,
        revertClone: true,
      },
      sort: false
    };

    this.dropZoneOptions = {
      group: {
        name: 'group2',
        put: ['group1'],
      },
      onUpdate: (event: any) => {
        // Event thrown when the list order change
        const oldIndex = event.oldIndex;
        const newIndex = event.newIndex;
        // Move array positions
        this.campaignStructure.splice(newIndex, 0, this.campaignStructure.splice(oldIndex, 1)[0]);
    
        this.saveCampaignStructure();
      },
      onAdd: (event: any) => {
        // Event thrown when we drop an element in the list
        const blockData = event.item.blockData;
        const newIndex = event.newIndex;
        const newBlockPosition = {
          blockType: blockData.name,
          position: newIndex,
          name: `${blockData.name}-${new Date().getTime().toString()}`,
          valid: (this.getBlockTypeInfo(blockData.name).properties.length>0) ? false : true
        };
        // Insert the element at a specific position
        this.campaignStructure.splice(newIndex, 0, newBlockPosition);
        this.saveCampaignStructure();
      }
    };
  }

  /**
   * Function called on the component initialization
   */
  ngOnInit() {

    this.setBlocksSize();

    // Get url parameters
    const brandName = this.route.snapshot.paramMap.get('brandName');
    const campaignName = this.route.snapshot.paramMap.get('campaignName');

    // Get the brands list
    this.apiService.getBrands().subscribe(brands => {
      if(brands.map(el => el.name).indexOf(brandName) == -1) {
        this.redirect404();
      } else {
        this.brand = brands.filter(el => el.name == brandName)[0];
        this.apiService.getCampaigns(this.brand.name).subscribe(campaigns => {
          if(campaigns.map(el => el.name).indexOf(campaignName) == -1) {
            this.redirect404();
          } else {
            this.campaign = campaigns.filter(el => el.name == campaignName)[0];

            // Get list of blocks available
            this.apiService.getBlocks(this.brand.name).subscribe(blocks => {
              this.blocks = blocks;
              const result = blocks.reduce((h, a) => Object.assign(h, { [a.category]:( h[a.category] || [] ).concat(a) }), {});
              for (let category in result) {
                result[category] = result[category].sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0));
              }
              this.categorizedBlocks = result;
            }, err => {
              this.toastrService.error('Une erreur s\'est produite lors du chargement des blocs.');
            });

            // Get the campaign structure and order it by position
            this.apiService.getCampaignStructure(this.brand.name, this.campaign.name).subscribe(structure => {
              this.campaignStructure = structure.sort((a, b) => a.position - b.position);

              // Get campaign options (languages)
              this.apiService.getCampaignOptions(this.brand.name, this.campaign.name).subscribe(options => {
                this.campaignOptions = options;
                this.campaignLanguages = Object.keys(this.campaignOptions.lang);
              }, err => {
                this.toastrService.error('Une erreur s\'est produite lors du chargement des options de la campagne.');
              });

              // Get the blocks data
              this.apiService.getBlocksData(this.brand.name, this.campaign.name).subscribe((blocksData) => {
                for (let i = 0; i < blocksData.length; i++) {
                  const blockInfo = this.getBlockInfo(blocksData[i].blockName);

                  if(blockInfo) {
                    // Remove lang from campaign data if deselected
                    blocksData[i].languages = blocksData[i].languages.filter((item) => {
                      return this.campaignLanguages.indexOf(item.lang) > -1;
                    });

                    // Add new lang data if lang added to campaign
                    const langToAdd = this.campaignLanguages.filter((item) => {
                      return blocksData[i].languages.map(el => el.lang).indexOf(item) === -1;
                    });

                    for (const lang of langToAdd) {
                      const el = {
                        lang: lang,
                        properties: [],
                        display: true
                      };

                      const isMaster = lang == this.campaignOptions.masterLang;

                      for (const blockProperty of blockInfo.properties) {
                        if (blockProperty.type === 'properties') {

                          const element = [];
                          const subProperties = [];
                          for (let j = 0; j < blockProperty.properties.length; j++) {
                            subProperties.push({
                              name: blockProperty.properties[j].name,
                              value: '',
                              copiedFromMaster: !isMaster
                            });
                          }

                          for (let i = 0; i < blockProperty.numberItems; i++) {
                            element.push(subProperties);
                          }

                          el.properties.push({
                            name: blockProperty.name,
                            value: element
                          });
                        } else {
                          el.properties.push({
                            name: blockProperty.name,
                            value: '',
                            copiedFromMaster: !isMaster
                          });
                        }
                      }

                      blocksData[i].languages.push(el);
                    }
                  }
                  this.apiService.setBlocksData(this.brand.name, this.campaign.name, blocksData).subscribe(() => {}, err => {
                    this.toastrService.error('Erreur lors de l\'enregistrement des données des blocs.');
                  });
                }
              }, err => {
                this.toastrService.error('Erreur lors du chargement des données des blocs.');
              });
            }, err => {
              this.toastrService.error('Une erreur s\'est produite lors du chargement de la structure.');
            });
          }
        });
      }
    });
  }

  /**
   * Function called whenever the window is resized
   * @param {any} event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setBlocksSize();
  }

  /**
   * Set the fixed block width and height - It has to be set because the block position is fixed
   */
  setBlocksSize() {
    let blocksFixedWidth;
    let blocksFixedMaxHeight = window.innerHeight - 260;
    
    try {
      blocksFixedWidth = parseInt(window.getComputedStyle(this.dragNDropBlocksList.nativeElement, null).getPropertyValue('width'));
    } catch(e) {
      // IE Fix
      blocksFixedWidth = this.dragNDropBlocksList.nativeElement.currentStyle.width;
    }

    blocksFixedWidth-=30; // Remove padding
    this.dragNDropBlocksList.nativeElement.querySelector('.fixed').style.width = `${blocksFixedWidth}px`;
    this.dragNDropBlocksList.nativeElement.querySelector('#builderBlockList').style.maxHeight = `${blocksFixedMaxHeight}px`;
  }

  /**
   * Remove a block from the campaign structure
   * @param {BlockPosition} block Block to remove from the campaign structure
   */
  removeBlock(block: BlockPosition) {
    this.campaignStructure = this.campaignStructure.filter(el => el !== block);
    this.saveCampaignStructure();
    if (this.getBlockTypeInfo(block.blockType).properties.length>0) {
      this.apiService.removeBlockData(this.brand.name, this.campaign.name, block.name).subscribe(() => {}, err => {
        this.toastrService.error('Erreur lors de la suppression du bloc.');
      });
    }
    this.modalBlockRemove.hide();
  }

  /**
   * Save the campaign structure by sending the data to the API
   */
  saveCampaignStructure() {
    for (let i = 0; i < this.campaignStructure.length; i++) {
      this.campaignStructure[i].position = i;
    }
    this.apiService.setCampaignStructure(this.brand.name, this.campaign.name, this.campaignStructure).subscribe(() => {}, err => {
      this.toastrService.error('Erreur lors de l\'enregistrement de la structure.');
    });
  }

  /**
   * Ge the block information by block type
   * @param {string} blockType Block type to get the information from
   */
  getBlockTypeInfo(blockType: string) {
    return this.blocks.filter(block => block.name === blockType)[0];
  }

  /**
   * Get the block information by block name
   * @param {string} blockName Name of the block to get the information from
   */
  getBlockInfo(blockName: string) {
    if (this.campaignStructure.filter(el => el.name === blockName).length>0) {
      return this.getBlockTypeInfo(this.campaignStructure.filter(el => el.name === blockName)[0].blockType);
    } else {
      return null;
    }
  }

  /**
   * Display the block deletion confirmation modal
   * @param {BlockPosition} block Name of the block that you want to delete
   */
  showDeleteConfirmation(block: BlockPosition) {
    this.block = block;
    this.modalBlockRemove.show();
  }

  /**
   * Show campaign email previews
   */
  showPreview() {
    this.buildInProgress = true;
    this.modalPreviewEmails.show();
    this.apiService.buildCampaign(this.brand.name, this.campaign.name).subscribe(data => {
      this.buildInProgress = false;
      this.previewLinks = data;
    }, err => {
      this.modalPreviewEmails.hide();
      this.buildInProgress = false;
      this.toastrService.error('Une erreur s\'est produite lors de la génération des emails.');
    });
  }

  /**
   * Open all previews at the same time
   */
  openAllPreviews() {
    if (this.previewLinks) {
      for (const link of this.previewLinks) {
        window.open(link.url, '_blank');
      }
    }
  }

  /**
   * Build the campaign emails and send a zip to client web browser
   */
  exportEmails() {
    this.buildInProgress = true;
    this.modalExportEmails.show();
    this.apiService.exportCampaign(this.brand.name, this.campaign.name).subscribe(data => {
      this.buildInProgress = false;
      this.modalExportEmails.hide();
      window.open(data.zipLink);
    }, err => {
      this.buildInProgress = false;
      this.modalExportEmails.hide();
      this.toastrService.error('Une erreur s\'est produite lors de l\'export des emails.');
    });
  }

  /**
   * Change a block status when we submit the block settings form
   * @param {any} event Event that contains a block and says wether its valid or not
   */
  setBlockStatus(event: any) {
    this.campaignStructure.filter(el => el.name == event.block.name)[0].valid = event.valid;
    this.saveCampaignStructure();
  }

  /**
   * Redirect the user on a 404 page
   */
  redirect404 = () => {
    this.router.navigate([`/404`]);
  }
}