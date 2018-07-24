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

declare const $: any;

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

  serverUrl: string;

  editorOptions: any;

  fileUploading: boolean;

  @Output() valid = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private uploadService: UploadService,
    private toastrService: ToastService
  ) {
    this.fileUploading = false;
  }

  /**
   * Function called on the component initialization
   */
  ngOnInit() { 
    // Get url parameters
    this.brandName = this.route.snapshot.paramMap.get('brandName');
    this.campaignName = this.route.snapshot.paramMap.get('campaignName');

    this.serverUrl = `${environment.serverUrl}/dist/${this.brandName}/${this.campaignName}/`;

    this.initWYSIWYG();

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

  /**
   * Function called before opening the modal window
   * @param {BlockPosition} block Block to edit
   */
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

  /**
   * Get the bloc informations (properties, etc.) by block type
   * @param {string} blockType Block type to get information from
   */
  getBlockTypeInfo(blockType: string) {
    return this.blocks.filter(block => block.name === blockType)[0];
  }

  /**
   * Set a block property value
   * @param {string} propertyName Name of the property that you want to edit
   * @param {string} lang Lang to edit
   * @param {any} event Event that contain new value
   * @param {string=} parentPropertyName Parent property name if child property (optional)
   * @param {number=} index Children index (optional)
   */
  setPropertyValue(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    const isColor = (color) => new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").test(color);

    if (parentPropertyName && index !== undefined) {
      // If it's a child attribute
      if (event.html && !this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0].copiedFromMaster
      ) {
        // If it's a WYSIWYG event
        event.html = this.updateWYSIWYGHtml(event.html);
        this.blockData.languages
          .filter(el => el.lang === lang)[0].properties
          .filter(el => el.name === parentPropertyName)[0].value[index]
          .filter(el => el.name === propertyName)[0].value = event.html;
      } else if(event.target) {
        // Input change event
        const newValue = (event.target.value) ? event.target.value : '';
        this.blockData.languages
          .filter(el => el.lang === lang)[0].properties
          .filter(el => el.name === parentPropertyName)[0].value[index]
          .filter(el => el.name === propertyName)[0].value = newValue;
      } else if(isColor(event)) {
        // Its a color
        this.blockData.languages
          .filter(el => el.lang === lang)[0].properties
          .filter(el => el.name === parentPropertyName)[0].value[index]
          .filter(el => el.name === propertyName)[0].value = event;
      }
    } else {
      if (event.html && !this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].copiedFromMaster) {
        // If it's a WYSIWYG event
        event.html = this.updateWYSIWYGHtml(event.html);
        this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = event.html;
      } else if(event.target) {
        // Input change event
        const newValue = (event.target.value) ? event.target.value : '';
        this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = newValue;
      } else if(isColor(event)) {
        this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = event;
      }
    }
  }

  /**
   * Upload a file and set data url
   * @param {string} propertyName Name of the property that you want to edit
   * @param {string} lang Lang to edit
   * @param {any} event Event must contain a file
   * @param {string=} parentPropertyName Parent property name if child property (optional)
   * @param {number=} index Children index (optional)
   */
  uploadFile(propertyName: string, lang: string, event: any, parentPropertyName?: string, index?: number) {
    if (event.target.files.length > 0) {
      this.fileUploading = true;

      // If there is a file attached to the input
      const image = event.target.files[0];

      // Delete the previous image from the server
      if (parentPropertyName && index !== undefined) { 
        if(this.blockData.languages
          .filter(el => el.lang === lang)[0].properties
          .filter(el => el.name === parentPropertyName)[0].value[index]
          .filter(el => el.name === propertyName)[0].value !== ''
        ) {
          this.removeImage(propertyName, lang, parentPropertyName, index);
        }
      } else if(this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value !== '') {
        this.removeImage(propertyName, lang);
      }
      
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
            this.fileUploading = false;
          } else {
            this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = data.imageUrl;
            this.fileUploading = false;
          }
        }
      }, err => {
        this.fileUploading = false;
        this.toastrService.error('Une erreur s\'est produite lors de l\'upload de l\'image.');
      });
    }
  }
  
  /**
   * Delete an image from the server
   * @param {string} propertyName Name of the property that you want to edit
   * @param {string} lang Lang to edit
   * @param {string=} parentPropertyName Parent property name if child property (optional)
   * @param {number=} index Children index (optional)
   */
  removeImage(propertyName: string, lang: string, parentPropertyName?: string, index?: number) {
    
    let oldImage = '';

    if (parentPropertyName && index !== undefined) {
      oldImage = this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0].value;
      this.blockData.languages
        .filter(el => el.lang === lang)[0].properties
        .filter(el => el.name === parentPropertyName)[0].value[index]
        .filter(el => el.name === propertyName)[0].value = '';
    } else {
      oldImage = this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value;
      this.blockData.languages.filter(el => el.lang === lang)[0].properties.filter(el => el.name === propertyName)[0].value = '';
    }

    if (oldImage !== '') {
      const filename = oldImage.substring(oldImage.lastIndexOf('/')+1);
      this.uploadService.removeImage(this.brandName, this.campaignName, filename).subscribe();
    }
  }

  /**
   * Toggle the visibility of a block in the lang given as a parameter
   * @param {string} lang Lang in which you want to toggle the block visibility
   */
  toggleVisibility(lang: string) {
    if (this.blockData) {
      this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display = !this.isVisible(lang);
    }
  }

  /**
   * Return true if the block is visible in the lang given as a parameter
   * @param {string} lang Lang in which you want to get the block visibility
   */
  isVisible(lang: string) {
    if (this.blockData) {
      return this.blockData.languages.filter(
        el => el.lang === lang
      )[0].display;
    }
  }

  /**
   * Function called when we change the "Copy from master" checkbox 
   * @param {string} propertyName Name of the property that you want to copy to
   * @param {string} lang Destination lang
   * @param {string=} parentPropertyName Parent property name if child property (optional)
   * @param {number=} index Children index (optional)
   */
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

  /**
   * Function called when we save a block - Checks if the block is valid and save the block data to the API
   * @param {NgForm} form Block settings form
   */
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

  /**
   * When we click on the cancel button, we discard the changes and close the modals
   */
  discardBlockSettings() {
    this.blockData = null;
    this.modalWarningSave.hide();
    this.modalBlockSettings.hide();
  }

  /**
   * Function called when the user click "Save the block" on the warning modal despite the errors
   */
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

  /**
   * Function that initialize Froala WYSIWYG Editor - It defines which element should be shown in the toolbar, etc.
   */
  initWYSIWYG() {
    this.editorOptions = {
      key: environment.froalaEditorKey,
      events : {
        'froalaEditor.contentChanged' : (e, editor) => {
          const html = editor.html.get();
          const propertyName = e.target['data-propertyName'];
          const lang = e.target['data-lang'];
          
          if (e.target['data-parentPropertyName'] && e.target['data-index']) {
            const parentPropertyName = e.target['data-parentPropertyName'];
            const index = e.target['data-index'];
            this.setPropertyValue(propertyName, lang, { html: html }, parentPropertyName, index);
          } else {
            this.setPropertyValue(propertyName, lang, { html: html });
          }
        }
      },
      toolbarButtons: [
        'bold_dropdown',
        'italic', 
        '|',
        'paragraphFormat',
        'clearFormatting',
        '|',
        'formatOL', 
        'formatUL', 
        '|',
        'undo', 
        'redo',
        '|',
        'insertLink',
        '|',
        'html'
      ],
      linkStyles: {
        linkFooter: 'linkFooter',
        linkContent: 'linkContent'
      },
      pluginsEnabled: ["align", "charCounter", "codeBeautifier", "codeView", "colors", "draggable", "entities", "fontFamily", "fontSize", "inlineStyle", "link", "lists", "paragraphFormat", "paragraphStyle", "quote", "save", "url", "wordPaste"],
    };

    // Add bold icon
    const editor = $.FroalaEditor;

    editor.DefineIcon('bold_dropdown', {NAME: 'bold'});
    editor.RegisterCommand('bold_dropdown', {
      title: 'Bold',
      type: 'dropdown',
      focus: false,
      undo: false,
      refreshAfterCallback: true,
      options: {
        'fontsize12': 'fontsize12',
        'fontsize16': 'fontsize16',
        'fontsize22': 'fontsize22',
        'fontsize25': 'fontsize25',
        'fontsize30': 'fontsize30',
        'fontsize52': 'fontsize52'
      },
      callback: function (cmd, val) {
        let txt = this.selection.text();
        if (txt === undefined || txt === '') return;
        this.format.toggle('strong', { class: val });
      }
    });
  }

  /**
   * Function executed when changing WYSIWYG block data - This function add a class to all html element for email compatibility purpose
   */
  updateWYSIWYGHtml(html: string) : string {
    const elements = $(html);
    // Add class to all parent elements
    elements.addClass('fontArial');
    // Add class to all children elements
    elements.find('*').not('br').addClass('fontArial');
    // Convert the selector back to a string
    let newHtml = '';
    elements.each(function() {
      newHtml += $(this).wrap('<div/>').parent().html();
    });
    // Return the new html
    return newHtml;
  }
}
