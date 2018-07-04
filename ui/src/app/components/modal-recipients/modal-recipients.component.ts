import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { Brand } from '../../models/brand';

import { ApiService } from '../../services/api.service';
import { Recipient } from '../../models/recipient';

@Component({
  selector: 'app-modal-recipients',
  templateUrl: './modal-recipients.component.html',
  styleUrls: ['./modal-recipients.component.scss']
})
export class ModalRecipientsComponent implements OnInit {

  @ViewChild('recipientsModal') recipientsModal;

  recipients: Recipient[];
  brand : Brand;
  newRecipient: Recipient;
  error: boolean;

  @Input() config: any;
  constructor(private apiService: ApiService) {
    this.newRecipient = new Recipient();
    this.error = false;
  }

  @Output() updated = new EventEmitter();

  ngOnInit() { }

  getRecipients(brandName: string, cb?: Function) {
    this.apiService.getRecipients(brandName).subscribe(recipients => {
      this.recipients = recipients;
      if(cb) {
        cb();
      }
    });
  }

  show(brand: Brand) {
    this.brand = brand;
    this.getRecipients(this.brand.name, () => {
      this.recipientsModal.show();
    });
  }

  edit(property: string, event: any, email?: string) {
    if(email) {
      // Edit mode
      this.recipients.filter(recipient => recipient.email == email)[0][property] = event.srcElement.innerText.trim();
    } else {
      // Add new recipient
      this.error = false;
      this.newRecipient[property] = event.srcElement.innerText.trim();
    }
  }

  remove(email: string) {
    this.recipients = this.recipients.filter(recipient => recipient.email !== email);
  }

  add() {
    if(
      this.newRecipient.firstname && this.newRecipient.firstname.length > 2
      && this.newRecipient.lastname && this.newRecipient.lastname.length > 2 
      && this.newRecipient.email && this.isEmailValid(this.newRecipient.email) && this.recipients.map(recipient => recipient.email).indexOf(this.newRecipient.email) == -1
    ) {
      this.recipients.push(this.newRecipient);
      // Reset the new recipient variable
      this.newRecipient = new Recipient();
    } else {
      this.error = true;
    }
  }

  save() {
    this.apiService.setRecipients(this.brand.name, this.recipients).subscribe(() => {
      this.updated.emit();
      this.recipientsModal.hide();
    });
  }

  isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
