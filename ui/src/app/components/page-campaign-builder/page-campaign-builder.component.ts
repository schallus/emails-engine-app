import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { FormControl } from '@angular/forms';

// RxJS
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';

// Custom
import { ApiService } from '../../services/api.service';

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

  constructor(private route: ActivatedRoute, private apiService: ApiService) {

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
          name: `${blockData.name}-${new Date().getTime().toString()}`,
          lang: this.campaignLanguages
        };
        // Insert the element at a specific position
        this.campaignStructure.splice(newIndex, 0, newBlockPosition);
        this.saveCampaignStructure();
      }
    };
  }

  ngOnInit() {
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
      this.blocks = blocks;
      this.filteredBlocks = this.blocks;
    });

    // Get the campaign structure and order it by position
    this.apiService.getCampaignStructure(this.brandName, this.campaignName).subscribe(structure => {
      this.campaignStructure = structure.sort((a, b) => a.position - b.position);

      // Get campaign options (languages)
      this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
        this.campaignOptions = options;
        this.campaignLanguages = Object.keys(this.campaignOptions.lang);

        // Change lang in campaign structure
        this.campaignStructure = this.campaignStructure.map(el => {
          el.lang = this.campaignLanguages;
          return el;
        });

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
                properties: {}
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
            properties: {}
          };

          for (const blockProperty of blockInfo.properties) {
            el.properties[blockProperty.name] = '';
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

  setPropertyValue(propertyName: string, lang: string, event: any) {
    this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName] = event.target.value;
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
      this.isCompletelyFilled(this.blockData.blockName);
    });
  }

  isCompletelyFilled(blockName: string) {
    this.apiService.getBlockData(this.brandName, this.campaignName, blockName).subscribe((data) => {
      data.languages.forEach((dataLang) => {
        console.log(dataLang);
        Object.keys(dataLang.properties).forEach(key => {
          if (dataLang.properties[key] === '') {
            console.log(`unset properties`);
            return false;
          }
        });
      });
      return true;
    });
  }
}
