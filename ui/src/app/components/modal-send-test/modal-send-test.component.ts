import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ApiService } from '../../services/api.service';

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
  constructor(private apiService: ApiService) { 
    this.sending = false;

    this.apiService.getBrands().subscribe(brands => {
      this.brand = brands.filter(brand => brand.name == this.brandName)[0];
    });
  }

  ngOnInit() { }

  show() {
    this.apiService.getRecipients(this.brandName).subscribe(recipients => {
      this.recipients = recipients.map(recipient => {
        recipient.selected = true;
        return recipient;
      });

      this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
        this.langSelected = Object.keys(options.lang).map(el => {
          return {
            code: el,
            selected: true
          };
        });
        
        this.modalSendEmails.show();
      });
    });
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

}
