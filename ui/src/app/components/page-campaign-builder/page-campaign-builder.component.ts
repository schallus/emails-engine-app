import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';

// RxJS
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';

// Custom
import { ApiService } from '../../services/api.service';
import { UploadService } from '../../services/upload.service';

// Models
import { Block } from './../../models/block';
import { BlockPosition } from '../../models/block-position';
import { TabsetComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-page-campaign-builder',
  templateUrl: './page-campaign-builder.component.html',
  styleUrls: ['./page-campaign-builder.component.scss']
})
export class PageCampaignBuilderComponent implements OnInit {

  @ViewChild('modalBlockRemove') public modalBlockRemove;
  @ViewChild('modalBlockSettings') public modalBlockSettings;
  @ViewChild('langTabs') langTabs: TabsetComponent;
  @ViewChild('dragNDropBlocksList') dragNDropBlocksList: any;


  // Url parameters
  brandName: string;
  campaignName: string;

  // Filter blocks
  filterBlock: string;
  filterBlockControl = new FormControl();
  formCtrlSub: Subscription;

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
  list1Options: SortablejsOptions;
  list2Options: SortablejsOptions;

  block: BlockPosition;
  blockData: any;

  blocksFixed: boolean;
  blocksFixedWidth: number;

  objectKeys = Object.keys;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private uploadService: UploadService,
    @Inject(DOCUMENT) private doc: Document
  ) {

    this.blocksFixed = false;
    this.filterBlock = '';

    this.list1Options = {
      group: {
        name: 'group1',
        pull: 'clone',
        put: false,
        revertClone: true,
      },
      sort: false
    };

    this.list2Options = {
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
          name: `${blockData.name}-${new Date().getTime().toString()}`
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
    });

    // Get the campaign structure and order it by position
    this.apiService.getCampaignStructure(this.brandName, this.campaignName).subscribe(structure => {
      this.campaignStructure = structure.sort((a, b) => a.position - b.position);

      // Get campaign options (languages)
      this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
        this.campaignOptions = options;
        this.campaignLanguages = Object.keys(this.campaignOptions.lang);

        this.apiService.setCampaignStructure(this.brandName, this.campaignName, this.campaignStructure)
          .subscribe(newCampaignStructure => this.campaignStructure = newCampaignStructure);

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

            langToAdd.forEach(lang => {
              const el = {
                lang: lang,
                properties: {},
                display: true
              };

              for (const blockProperty of blockInfo.properties) {
                el.properties[blockProperty.name] = '';
              }

              blocksData[i].languages.push(el);
            });
          }
          this.apiService.setBlocksData(this.brandName, this.campaignName, blocksData).subscribe();
        });
      });
    });

    // Event thrown when the user change the search blocks input value
    // We wait for half a second without any new key pressed before to throw the event
    this.formCtrlSub = this.filterBlockControl.valueChanges
      .debounceTime(500)
      .subscribe(newValue => {
        this.filterBlock = newValue;
        this.filterBlocks();
      });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (!this.blocksFixed && window.pageYOffset > 185) {
      this.blocksFixed = true;
      this.dragNDropBlocksList.nativeElement.style.width = `${this.blocksFixedWidth}px`;
    } else if (this.blocksFixed && window.pageYOffset < 185) {
      this.blocksFixed = false;
    }
  }

  filterBlocks() {
    this.filteredBlocks = this.blocks.filter(block => block.displayName.toLowerCase().indexOf(this.filterBlock.toLowerCase()) > -1);
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

  showBlockSettings(block: BlockPosition) {
    this.block = block;
    this.langTabs.tabs[0].active = true;
    // Get the block data
    this.apiService.getBlockData(this.brandName, this.campaignName, this.block.name).subscribe(data => {
      this.blockData = data;

      if (!this.blockData) {
        // Si le bloc vient d'être créé ou n'as pas encore reçu de données

        const blockInfo = this.getBlockTypeInfo(block.blockType);

        const langData = [];

        this.blockData = {
          blockName: block.name,
          languages: langData
        };

        for (const lang of this.campaignLanguages) {
          const el = {
            lang: lang,
            properties: {},
            display: true
          };

          for (const blockProperty of blockInfo.properties) {
            if (blockProperty.type === 'properties') {
              el.properties[blockProperty.name] = [];
              for (let i = 0; i < blockProperty.numberItems; i++) {
                const newObject = {};
                for (let j = 0; j < blockProperty.properties.length; j++) {
                  newObject[blockProperty.properties[j].name] = '';
                }
                el.properties[blockProperty.name].push(newObject);
              }
            } else {
              el.properties[blockProperty.name] = '';
            }
          }

          langData.push(el);
        }
        this.apiService.setBlockData(this.brandName, this.campaignName, this.blockData).subscribe(newBlockData => {
          // After the block data set, we open the modal
          this.modalBlockSettings.show();
        });
      } else {
          this.modalBlockSettings.show();
      }
    });
  }

  showPreview() {
    this.apiService.buildCampaign(this.brandName, this.campaignName).subscribe(data => {
      console.log(data);
    });
  }

  removeBlock(block: BlockPosition) {
    this.campaignStructure = this.campaignStructure.filter(el => el !== block);
    this.saveCampaignStructure();
    this.apiService.removeBlockData(this.brandName, this.campaignName, block.name).subscribe();
    this.modalBlockRemove.hide();
  }

  saveCampaignStructure() {
    for (let i = 0; i < this.campaignStructure.length; i++) {
      this.campaignStructure[i].position = i;
    }
    this.apiService.setCampaignStructure(this.brandName, this.campaignName, this.campaignStructure).subscribe();
  }

  getPropertyValue(propertyName: string, lang: string) {
    if (this.blockData) {
      return this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName];
    } else {
      return '';
    }
  }

  setPropertyValue(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (parentPropertyName && index !== undefined) {
      this.blockData.languages.filter(el => el.lang === lang)[0].properties[parentPropertyName][index][propertyName] = event.target.value;
    } else {
      this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName] = event.target.value;
    }
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
  }

  uploadFile(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0];

      this.uploadService.uploadImage(this.brandName, this.campaignName, image).subscribe((data) => {
        if (data && data.imageUrl) {
          if (parentPropertyName && index !== undefined) {
            this.blockData.languages
              .filter(el => el.lang === lang)[0].properties[parentPropertyName][index][propertyName] = data.imageUrl;
          } else {
            this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName] = data.imageUrl;
          }
          this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
        }
      });
    }
  }

  toggleVisibility(lang: string) {
    if (this.blockData) {
      this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display = !this.isVisible(lang);
      this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
    }
  }

  isVisible(lang: string) {
    if (this.blockData) {
      return this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display;
    }
  }

  colorPickerChange(propertyName: string, lang: string, color: any) {
    this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName] = `'${color}'`;
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
  }

  isCompletelyFilled(blockName: string) {
    const blockInfo = this.getBlockInfo(blockName);
    this.apiService.getBlockData(this.brandName, this.campaignName, blockName).subscribe((data) => {
      data.languages.forEach((dataLang) => {
        Object.keys(dataLang.properties).forEach(key => {
          if (dataLang.properties[key] === '' && blockInfo.properties.filter(property => property.name === key)[0].required) {
            console.log(`Property '${key}' in lang '${dataLang.lang}' is required.`);
          }
        });
      });
      return true;
    });
  }
}
