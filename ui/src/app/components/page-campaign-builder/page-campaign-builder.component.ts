import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { FormControl, NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { TabsetComponent } from 'ng-uikit-pro-standard';

// RxJS
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';

// Custom
import { ApiService } from '../../services/api.service';
import { UploadService } from '../../services/upload.service';

// Models
import { Block } from './../../models/block';
import { BlockPosition } from '../../models/block-position';
import { RecipientSelected } from '../../models/recipient';

@Component({
  selector: 'app-page-campaign-builder',
  templateUrl: './page-campaign-builder.component.html',
  styleUrls: ['./page-campaign-builder.component.scss']
})
export class PageCampaignBuilderComponent implements OnInit {

  @ViewChild('modalBlockRemove') public modalBlockRemove;
  @ViewChild('modalBlockSettings') public modalBlockSettings;
  @ViewChild('modalPreviewEmails') public modalPreviewEmails;
  @ViewChild('modalExportEmails') public modalExportEmails;
  @ViewChild('modalWarningSave') public modalWarningSave;
  @ViewChild('modalSendEmails') public modalSendEmails;
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

  recipients: RecipientSelected[];
  langSelected: Array<{code: string, selected: boolean}>;
  sending: boolean;

  previewLinks: Array<{url: string, lang: string}>;
  buildInProgress: boolean;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private uploadService: UploadService,
    @Inject(DOCUMENT) private doc: Document
  ) {

    this.blocksFixed = false;
    this.buildInProgress = false;
    this.sending = false;
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
        this.langSelected = this.campaignLanguages.map(el => {
          return {
            code: el,
            selected: true
          };
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
      this.dragNDropBlocksList.nativeElement.querySelector('#builderBlockList').style.maxHeight = `${window.innerHeight * 0.7}px`;
    } else if (this.blocksFixed && window.pageYOffset < 185) {
      this.blocksFixed = false;
      this.dragNDropBlocksList.nativeElement.style.width = `auto`;
      this.dragNDropBlocksList.nativeElement.querySelector('#builderBlockList').style.maxHeight = `500px`;
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

          langData.push(el);
        }
        this.apiService.setBlockData(this.brandName, this.campaignName, this.blockData).subscribe(newBlockData => {
          // After the block data set, we open the modal

          console.log('blockData', newBlockData);
          this.modalBlockSettings.show();
        });
      } else {
        console.log('blockData', this.blockData);
        this.modalBlockSettings.show();
      }
    });
  }

  showPreview() {
    this.buildInProgress = true;
    this.modalPreviewEmails.show();
    this.apiService.buildCampaign(this.brandName, this.campaignName).subscribe(data => {
      this.buildInProgress = false;
      this.previewLinks = data;
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
      window.open(data.zipLink);
      this.modalExportEmails.hide();
    });
  }

  configureTestEmail() {
    if (!this.recipients) {
      // Get list of recipients
      this.apiService.getRecipients(this.brandName).subscribe(recipients => {
        this.recipients = recipients.map(recipient => {
          recipient.selected = true;
          return recipient;
        });

        this.modalSendEmails.show();
      });
    } else {
      this.modalSendEmails.show();
    }
  }

  sendTestEmail() {
    const recipients = this.recipients.filter(el => el.selected).map(el => el.email);
    const languages = this.langSelected.filter(el => el.selected).map(el => el.code);

    this.sending = true;
    this.apiService.sendTestEmails(this.brandName, this.campaignName, recipients, languages).subscribe(() => {
      this.sending = false;
      this.modalSendEmails.hide();
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

  setPropertyValue(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (parentPropertyName && index !== undefined) {
      this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0].value = event.target.value;
    } else {
      this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = event.target.value;
    }
    // DO NOT SAVE AFTER EACH MODIFICATIONS
    // this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
  }

  uploadFile(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0];

      this.uploadService.uploadImage(this.brandName, this.campaignName, image).subscribe((data) => {
        if (data && data.imageUrl) {
          if (parentPropertyName && index !== undefined) {
            this.blockData.languages
              .filter(el => el.lang === lang)[0].properties
              .filter(el => el.name === parentPropertyName)[0].value[index]
              .filter(el => el.name === propertyName)[0].value = data.imageUrl;
          } else {
            this.blockData.languages.filter(el => el.lang === lang)[0].properties[propertyName] = data.imageUrl;
          }
          //this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
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

  copyFromMaster(propertyName: string, lang: string, parentPropertyName?: string, index?: number) {
    if (parentPropertyName && index !== undefined) {
      const propertyValue = this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0];
      propertyValue.copiedFromMaster = !propertyValue.copiedFromMaster;
      console.log('copyFromMaster', propertyValue.copiedFromMaster);
    } else {
      const propertyValue = this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0];
      propertyValue.copiedFromMaster = !propertyValue.copiedFromMaster;
      console.log('copyFromMaster', propertyValue.copiedFromMaster);
    }
  }

  colorPickerChange(propertyName: string, lang: string, color: any, parentPropertyName?: string, index?: number) {
    if (parentPropertyName && index !== undefined) {
      this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0].value = `'${color}'`;
    } else {
      this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = `'${color}'`;
    }
    //this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe();
  }

  onBlockSettingsFormSubmit(form: NgForm) {
    console.log(form.value);
    console.log('The form is valid', form.valid);
    if (!form.valid) {
      this.modalWarningSave.show();
    } else {
      this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
        this.modalBlockSettings.hide();
      });
    }
  }

  discardBlockSettings() {
    this.blockData = null;
    this.modalWarningSave.hide();
    this.modalBlockSettings.hide();
  }

  saveBlockSettings() {
    console.log('Save blockData', this.blockData);
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
      this.modalWarningSave.hide();
      this.modalBlockSettings.hide();
    });
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
