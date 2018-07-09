import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent, ToastService } from 'ng-uikit-pro-standard';

// Environment variables
import { environment } from '../../../environments/environment';

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
  blockInfo: Block;
  blockData: any;
  blocks: Block[];

  campaignOptions: any;
  campaignLanguages: string[];

  showSourceCode: boolean;

  serverUrl: string;

  // Options for Quill WYSIWYG Editor
  quillOptions = {
    toolbar: [
      ['bold', 'italic'],                                 // toggled buttons
      // ['blockquote', 'code-block'],
      // [{ 'header': 1 }, { 'header': 2 }],              // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],        // superscript/subscript
      // [{ 'indent': '-1'}, { 'indent': '+1' }],         // outdent/indent
      // [{ 'direction': 'rtl' }],                        // text direction
      // [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      // [{ 'color': [] }, { 'background': [] }],         // dropdown with defaults from theme
      // [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                          // remove formatting button
      ['link', /*'image', 'video'*/]                      // link and image, video
    ]
  };

  @Output() valid = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private uploadService: UploadService,
    private toastrService: ToastService
  ) {
    this.showSourceCode = false;
    this.serverUrl = environment.serverUrl;
  }

  ngOnInit() { 
    // Get url parameters
    this.brandName = this.route.snapshot.paramMap.get('brandName');
    this.campaignName = this.route.snapshot.paramMap.get('campaignName');

    // Get blocks available
    this.apiService.getBlocks(this.brandName).subscribe(blocks => {
      this.blocks = blocks;
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des blocs.');
    });

    // Get campaign options
    this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
      this.campaignOptions = options;
      // Get the languages list and sort it by master then alphabetical order
      this.campaignLanguages = Object.keys(this.campaignOptions.lang)
        .filter(el => el !== this.campaignOptions.masterLang)
        .sort();
      this.campaignLanguages.splice(0, 0, this.campaignOptions.masterLang);
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des options.');
    });
  }

  // Function called before opening the modal window
  show(block: BlockPosition) {
    this.block = block;
    this.blockInfo = this.getBlockTypeInfo(block.blockType);

    // Get the block data
    this.apiService.getBlockData(this.brandName, this.campaignName, this.block.name).subscribe(data => {
      this.blockData = data;

      if (!this.blockData) {
        // If the block did not receive any data yet
        // We build the block data structure in order to receive data
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
        // We send the block data to the API
        this.apiService.setBlockData(this.brandName, this.campaignName, this.blockData).subscribe(newBlockData => {
          // After the block data set, we open the modal
          this.langTabs.tabs[0].active = true;
          this.modalBlockSettings.show();
        }, err => {
          this.toastrService.error('Erreur lors de l\'enregistrement des données.');
        });
      } else {
        // If the block already have data, we open the modal directly
        this.langTabs.tabs[0].active = true;
        this.modalBlockSettings.show();
      }
    }, err => {
      this.toastrService.error('Erreur lors du chargement des données du bloc.');
    });
  }

  // Get the bloc informations (properties, etc.) by block type
  getBlockTypeInfo(blockType: string) {
    return this.blocks.filter(block => block.name === blockType)[0];
  }


  // Set a property value
  setPropertyValue(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (parentPropertyName && index !== undefined) {
      // If it's a child attribute
      if (event.html && !this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0].copiedFromMaster
      ) {
        // If it's a WYSIWYG event
        this.blockData.languages
          .filter(el => el.lang === lang)[0].properties
          .filter(el => el.name === parentPropertyName)[0].value[index]
          .filter(el => el.name === propertyName)[0].value = event.html;
      } else if(event.target && event.target.value) {
        // Input change event
        this.blockData.languages
          .filter(el => el.lang === lang)[0].properties
          .filter(el => el.name === parentPropertyName)[0].value[index]
          .filter(el => el.name === propertyName)[0].value = event.target.value;
      }
    } else {
      if (event.html && !this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].copiedFromMaster) {
        // If it's a WYSIWYG event
        this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = event.html;
      } else if(event.target && event.target.value) {
        // Input change event
        this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = event.target.value;
      }
    }
  }

  uploadFile(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (event.target.files.length > 0) {
      // If there is a file attached to the input
      const image = event.target.files[0];

      // We upload the image to the server using an API endpoint
      this.uploadService.uploadImage(this.brandName, this.campaignName, image).subscribe((data) => {
        if (data && data.imageUrl) {
          // We successfuly received an answer from the server
          if (parentPropertyName && index !== undefined) {
            // If it's a child property
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

  // Toggle the visibility of a block in the lang given as a parameter
  toggleVisibility(lang: string) {
    if (this.blockData) {
      this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display = !this.isVisible(lang);
    }
  }

  // Return true if the block is visible in the lang given as a parameter
  isVisible(lang: string) {
    if (this.blockData) {
      return this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display;
    }
  }

  // Function called when we change the "Copy from master" checkbox 
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

  // Function called when we change the value of a color picker
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

  // Function called when we save a block
  onBlockSettingsFormSubmit(form: NgForm) {
    if (!form.valid) {
      // If the form is invalid, we open a modal
      this.modalWarningSave.show();
    } else {
      // We emit an event to tell the parent that the block is valid
      this.valid.emit({ block: this.block, valid: true });
      // We update the block data by calling the API
      this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
        this.modalBlockSettings.hide();
      }, err => {
        this.toastrService.error('Une erreur s\'est produite lors de l\'enregistrement du bloc.');
      });
    }
  }

  // When we click on the cancel button, we discard the changes and close the modals
  discardBlockSettings() {
    this.blockData = null;
    this.modalWarningSave.hide();
    this.modalBlockSettings.hide();
  }

  // Function called when the user click "Save the block" on the warning modal despite the errors
  saveBlockSettings() {
    this.apiService.changeBlockData(this.brandName, this.campaignName, this.blockData.blockName, this.blockData).subscribe(() => {
      // Emit an event to tell the parent component that the block is invalid
      this.valid.emit({ block: this.block, valid: false });
      // Hide the modals
      this.modalWarningSave.hide();
      this.modalBlockSettings.hide();
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors de l\'enregistrement du bloc.');
    });
  }
}
