import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { FormControl } from '@angular/forms';

// RxJS
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

// Custom
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
  @ViewChild('modalBlockSettings') public modalBlockSettings;

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

  // joditConfiguration: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {

    this.filterBlock = '';

    /*
    this.joditConfiguration = {
      spellcheck: false,
      defaultMode: '1',
      toolbarSticky: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      buttons: ',,,,,,,,,,paragraph,|,link,|,align,undo,redo,|,symbol,fullsize,selectall'
    };
    */

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
    });

    // Get campaign options (languages)
    this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
      this.campaignOptions = options;
      // this.campaignLanguages = ['ab', 'cd', 'ef', 'gh' , 'ij', 'kl', 'mn', 'op', 'qr'];
      this.campaignLanguages = Object.keys(this.campaignOptions.lang);
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

  showDeleteConfirmation(block: BlockPosition) {
    this.block = block;
    this.modalBlockRemove.show();
  }

  showBlockSettings(block: BlockPosition) {
    this.block = block;
    // Get the block data
    this.apiService.getBlockData(this.brandName, this.campaignName, this.block.name).subscribe(data => {
      this.blockData = data;
      if (!this.blockData || Object.keys(this.blockData.languages).length < this.campaignLanguages.length) {

        const blockInfo = this.getBlockTypeInfo(block.blockType);
        console.log(blockInfo);

        if (!this.blockData) {
          // Si le bloc vient d'être créé ou n'as pas encore reçu de données

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
        } else if (Object.keys(this.blockData.languages).length < this.campaignLanguages.length) {
          // Si il y a une nouvelle langue
          console.log('One language missing!');
          for (const lang of this.campaignLanguages) {
            let langMissing = true;
            for (const blockDataLang of this.blockData.languages) {
              if (blockDataLang.lang === lang) {
                langMissing = false;
              }
            }
            if (langMissing) {
              console.log('lang missing', lang);
              const el = {
                lang: lang,
                properties: {}
              };

              for (const blockProperty of blockInfo.properties) {
                el.properties[blockProperty.name] = '';
              }

              this.blockData.languages.push(el);

              console.log('this.blockData updated', this.blockData);
            }
          }
        }
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
    this.modalBlockRemove.hide();
  }

  saveCampaignStructure() {
    for (let i = 0; i < this.campaignStructure.length; i++) {
      this.campaignStructure[i].position = i;
    }
    this.apiService.setCampaignStructure(this.brandName, this.campaignName, this.campaignStructure).subscribe(data => {
      console.log(data);
      console.log('Campaign structure changed', this.campaignStructure);
    });
  }

  getPropertyValue(propertyName: string, lang: string) {
    if (this.blockData) {
      return this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName];
    } else {
      return '';
    }
  }

  setPropertyValue(propertyName: string, lang: string, value: string) {
    this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName] = value;
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(data => {
      console.log(data);
      console.log('Block data changed', this.blockData);
    });
  }

}
