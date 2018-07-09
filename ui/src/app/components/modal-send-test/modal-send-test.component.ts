import { Component, OnInit, Input, ViewChild } from '@angular/core';

// Services
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiService } from '../../services/api.service';

// Models
import { RecipientSelected } from '../../models/recipient';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-modal-send-test',
  templateUrl: './modal-send-test.component.html',
  styleUrls: ['./modal-send-test.component.scss']
})
export class ModalSendTestComponent implements OnInit {

  @ViewChild('modalSendEmails') public modalSendEmails;

  recipients: RecipientSelected[];
  langSelected: Array<{code: string, selected: boolean}>;
  sending: boolean;
  brand: Brand;

  
  @Input() brandName: string;
  @Input() campaignName: string;
  constructor(
    private apiService: ApiService,
    private toastrService: ToastService
  ) { 
    this.sending = false;
  }

  ngOnInit() { }

  // Get the recipient list and execute the callback function if set
  getRecipients(brandName: string, cb?: Function) {
    this.apiService.getRecipients(brandName).subscribe(recipients => {
      this.recipients = recipients.map(recipient => {
        recipient.selected = true;
        return recipient;
      });
      if(cb) {
        cb();
      }
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des destinataires.');
    });
  }

  // Function called before to show the modal
  show() {
    // Get the current brand information
    this.apiService.getBrands().subscribe(brands => {
      this.brand = brands.filter(brand => brand.name == this.brandName)[0];
      // Get the brand recipients list
      this.getRecipients(this.brandName, () => {
        this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
          this.langSelected = Object.keys(options.lang).map(el => {
            return {
              code: el,
              selected: true
            };
          });
          
          this.modalSendEmails.show();
        }, err => {
          this.toastrService.error('Une erreur s\'est produite lors du chargement des langues.');
        });
      });
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement de la marque.');
    });
  }

  // Send the emails
  sendTestEmail() {
    const recipients = this.recipients.filter(el => el.selected).map(el => el.email);
    const languages = this.langSelected.filter(el => el.selected).map(el => el.code);

    this.sending = true;
    this.apiService.sendTestEmails(this.brandName, this.campaignName, recipients, languages).subscribe(data => {
      this.sending = false;
      this.modalSendEmails.hide();
      this.toastrService.success('Les emails ont été envoyés avec succès.');
    }, err => {
      console.log(err);
      this.sending = false;
      this.modalSendEmails.hide();
      this.toastrService.error('Une erreur s\'est produite lors de l\'envoi des emails.');
    });
  }

}
