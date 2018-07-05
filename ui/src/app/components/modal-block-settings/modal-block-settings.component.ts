import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent, ToastService } from 'ng-uikit-pro-standard';

// Services
import { ApiService } from '../../services/api.service';
import { UploadService } from '../../services/upload.service';

// Models
import { BlockPosition } from '../../models/block-position';
import { Block } from '../../models/block';

@Component({
  selector: 'app-modal-block-settings',
  templateUrl: './modal-block-settings.component.html',
  styleUrls: ['./modal-block-settings.component.scss']
})
export class ModalBlockSettingsComponent implements OnInit {

  @ViewChild('modalBlockSettings') public modalBlockSettings;
  @ViewChild('modalWarningSave') public modalWarningSave;
  @ViewChild('langTabs') langTabs: TabsetComponent;

  brandName: string;
  campaignName: string;

  block: BlockPosition;
  blockData: any;
  blocks: Block[];

  campaignOptions: any;
  campaignLanguages: string[];

  @Output() valid = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private uploadService: UploadService,
    private toastrService: ToastService
  ) { }

  ngOnInit() { 
    // Get url parameters
    this.brandName = this.route.snapshot.paramMap.get('brandName');
    this.campaignName = this.route.snapshot.paramMap.get('campaignName');

    this.apiService.getBlocks(this.brandName).subscribe(blocks => {
      this.blocks = blocks;
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des blocs.');
    });

    this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
      this.campaignOptions = options;
      this.campaignLanguages = Object.keys(this.campaignOptions.lang);
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des options.');
    });
  }

  show(block: BlockPosition) {
    this.block = block;
    // Get the block data
    this.apiService.getBlockData(this.brandName, this.campaignName, this.block.name).subscribe(data => {
      this.blockData = data;

      if (!this.blockData) {
        // Si le bloc vient d'être créé ou n'as pas encore reçu de données

        const blockInfo = this.getBlockTypeInfo(this.block.blockType);

        const langData = [];

        this.blockData = {
          blockName: this.block.name,
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
          this.langTabs.tabs[0].active = true;
          this.modalBlockSettings.show();
        }, err => {
          this.toastrService.error('Erreur lors de l\'enregistrement des données.');
        });
      } else {
        this.langTabs.tabs[0].active = true;
        this.modalBlockSettings.show();
      }
    }, err => {
      this.toastrService.error('Erreur lors du chargement des données du bloc.');
    });
  }

  getBlockTypeInfo(blockType: string) {
    return this.blocks.filter(block => block.name === blockType)[0];
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
            this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = data.imageUrl;
          }
        }
      }, err => {
        this.toastrService.error('Une erreur s\'est produite lors de l\'upload de l\'image.');
      });
    }
  }

  toggleVisibility(lang: string) {
    if (this.blockData) {
      this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display = !this.isVisible(lang);
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
    } else {
      const propertyValue = this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0];
      propertyValue.copiedFromMaster = !propertyValue.copiedFromMaster;
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
  }

  onBlockSettingsFormSubmit(form: NgForm) {
    if (!form.valid) {
      this.modalWarningSave.show();
    } else {
      this.valid.emit({ block: this.block, valid: true });
      this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
        this.modalBlockSettings.hide();
      }, err => {
        this.toastrService.error('Une erreur s\'est produite lors de l\'enregistrement du bloc.');
      });
    }
  }

  discardBlockSettings() {
    this.blockData = null;
    this.modalWarningSave.hide();
    this.modalBlockSettings.hide();
  }

  saveBlockSettings() {
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
      this.valid.emit({ block: this.block, valid: false });
      this.modalWarningSave.hide();
      this.modalBlockSettings.hide();
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors de l\'enregistrement du bloc.');
    });
  }
}
