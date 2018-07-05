import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { DOCUMENT } from '@angular/platform-browser';

// Services
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiService } from '../../services/api.service';

// Models
import { Block } from './../../models/block';
import { BlockPosition } from '../../models/block-position';

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
  brandName: string;
  campaignName: string;

  // Breadcrumbs
  breadcrumbs: Array<{title: string, path: string}>;

  // Liste des blocs
  blocks: Block[];
  filteredBlocks: Block[];

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
  blocksFixedWidth: number;

  previewLinks: Array<{url: string, lang: string}>;
  buildInProgress: boolean;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    @Inject(DOCUMENT) private doc: Document,
    private toastrService: ToastService
  ) {

    this.blocksFixed = false;
    this.buildInProgress = false;

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

  ngOnInit() {
    this.blocksFixedWidth = this.dragNDropBlocksList.nativeElement.clientWidth;

    // Get url parameters
    this.brandName = this.route.snapshot.paramMap.get('brandName');
    this.campaignName = this.route.snapshot.paramMap.get('campaignName');

    // Set the breadcrumbs
    this.breadcrumbs = [
      { title: 'Marques', path: '/brands' },
      { title: 'Campagnes', path: `/brands/${this.brandName}/campaigns` },
      { title: 'Editeur d\'email', path: `/brands/${this.brandName}/campaigns/${this.campaignName}/options` },
    ];

    // Get list of blocks available
    this.apiService.getBlocks(this.brandName).subscribe(blocks => {
      this.blocks = blocks.sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0));
      this.filteredBlocks = this.blocks;
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des blocs.');
    });

    // Get the campaign structure and order it by position
    this.apiService.getCampaignStructure(this.brandName, this.campaignName).subscribe(structure => {
      this.campaignStructure = structure.sort((a, b) => a.position - b.position);
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement de la structure.');
    });

    // Get campaign options (languages)
    this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
      this.campaignOptions = options;
      this.campaignLanguages = Object.keys(this.campaignOptions.lang);
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des options de la campagne.');
    });

    // Get the blocks data
    this.apiService.getBlocksData(this.brandName, this.campaignName).subscribe((blocksData) => {
      for (let i = 0; i < blocksData.length; i++) {
        const blockInfo = this.getBlockInfo(blocksData[i].blockName);

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
      this.apiService.setBlocksData(this.brandName, this.campaignName, blocksData).subscribe(() => {}, err => {
        this.toastrService.error('Erreur lors de l\'enregistrement des données des blocs.');
      });
    }, err => {
      this.toastrService.error('Erreur lors du chargement des données des blocs.');
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (!this.blocksFixed && window.pageYOffset > 185) {
      this.blocksFixed = true;
      this.dragNDropBlocksList.nativeElement.style.width = `${this.blocksFixedWidth}px`;
      this.dragNDropBlocksList.nativeElement.querySelector('#builderBlockList').style.maxHeight = `${window.innerHeight - 300}px`;
    } else if (this.blocksFixed && window.pageYOffset < 185) {
      this.blocksFixed = false;
      this.dragNDropBlocksList.nativeElement.style.width = `auto`;
      this.dragNDropBlocksList.nativeElement.querySelector('#builderBlockList').style.maxHeight = `500px`;
    }
  }

  removeBlock(block: BlockPosition) {
    this.campaignStructure = this.campaignStructure.filter(el => el !== block);
    this.saveCampaignStructure();
    this.apiService.removeBlockData(this.brandName, this.campaignName, block.name).subscribe(() => {}, err => {
      this.toastrService.error('Erreur lors de la suppression du bloc.');
    });
    this.modalBlockRemove.hide();
  }

  saveCampaignStructure() {
    for (let i = 0; i < this.campaignStructure.length; i++) {
      this.campaignStructure[i].position = i;
    }
    this.apiService.setCampaignStructure(this.brandName, this.campaignName, this.campaignStructure).subscribe(() => {}, err => {
      this.toastrService.error('Erreur lors de l\'enregistrement de la structure.');
    });
  }

  filterBlocks(event: any) {
    this.filteredBlocks = this.blocks.filter(block => block.displayName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
  }

  getBlockTypeInfo(blockType: string) {
    return this.blocks.filter(block => block.name === blockType)[0];
  }

  getBlockInfo(blockName: string) {
    return this.getBlockTypeInfo(this.campaignStructure.filter(el => el.name === blockName)[0].blockType);
  }

  showDeleteConfirmation(block: BlockPosition) {
    this.block = block;
    this.modalBlockRemove.show();
  }

  showPreview() {
    this.buildInProgress = true;
    this.modalPreviewEmails.show();
    this.apiService.buildCampaign(this.brandName, this.campaignName).subscribe(data => {
      this.buildInProgress = false;
      this.previewLinks = data;
    }, err => {
      this.modalPreviewEmails.hide();
      this.buildInProgress = false;
      this.toastrService.error('Une erreur s\'est produite lors de la génération des emails.');
    });
  }

  openAllPreviews() {
    if (this.previewLinks) {
      for (const link of this.previewLinks) {
        window.open(link.url, '_blank');
      }
    }
  }

  exportEmails() {
    this.buildInProgress = true;
    this.modalExportEmails.show();
    this.apiService.exportCampaign(this.brandName, this.campaignName).subscribe(data => {
      this.buildInProgress = false;
      this.modalExportEmails.hide();
      window.open(data.zipLink);
    }, err => {
      this.buildInProgress = false;
      this.modalExportEmails.hide();
      this.toastrService.error('Une erreur s\'est produite lors de l\'export des emails.');
    });
  }

  setBlockStatus(event: any) {
    this.campaignStructure.filter(el => el.name == event.block.name)[0].valid = event.valid;
    this.saveCampaignStructure();
  }
}
