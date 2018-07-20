import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

// Services
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiService } from '../../services/api.service';

// Models
import { Brand } from '../../models/brand';
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
  constructor(
    private apiService: ApiService,
    private toastrService: ToastService
  ) {
    this.newRecipient = new Recipient();
    this.error = false;
  }

  @Output() updated = new EventEmitter();

  /**
   * Function called on the component initialization
   */
  ngOnInit() { }

  /**
   * Get the recipient list and execute the callback function if set
   */
  getRecipients(brandName: string, cb?: Function) {
    this.apiService.getRecipients(brandName).subscribe(recipients => {
      this.recipients = recipients;
      if(cb) {
        cb();
      }
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des destinataires.');
    });
  }

  /**
   * Get the recipient list and execute the callback function if set
   * @param {Brand} brand Brand to get the recipients list from
   */
  show(brand: Brand) {
    this.brand = brand;
    // Get the recipients before to open the modal
    this.getRecipients(this.brand.name, () => {
      this.recipientsModal.show();
    });
  }

  /**
   * Add or update a recipient
   * @param {string} property Property to add or edit
   * @param {any} event Event that contain the new value
   * @param {string=} email Email of the recipient to update (optional)
   */
  edit(property: string, event: any, email?: string) {
    if(email) {
      // Edit mode
      this.recipients.filter(recipient => recipient.email == email)[0][property] = event.target.innerText.trim();
    } else {
      // Add new recipient
      this.error = false;
      this.newRecipient[property] = event.target.innerText.trim();
    }
  }

  /**
   * Remove a recipient from the list
   * @param {string} email Email of the recipient to remove
   */
  remove(email: string) {
    this.recipients = this.recipients.filter(recipient => recipient.email !== email);
  }

  /**
   * Add a new recipient to the list
   */
  add() {
    // Check that all the fields are set correctly
    if(
      this.newRecipient.firstname && this.newRecipient.firstname.length > 2
      && this.newRecipient.lastname && this.newRecipient.lastname.length > 2 
      && this.newRecipient.email && this.isEmailValid(this.newRecipient.email) && this.recipients.map(recipient => recipient.email).indexOf(this.newRecipient.email) == -1
    ) {
      // Add the recipient
      this.recipients.push(this.newRecipient);
      // Reset the new recipient variable
      this.newRecipient = new Recipient();
    } else {
      // Display an error
      this.error = true;
    }
  }

  /**
   * Save the new recipients list by sending it to the API
   */
  save() {
    this.apiService.setRecipients(this.brand.name, this.recipients).subscribe(() => {
      // Emit an event so that the parent knows when the recipients list gets updated
      this.updated.emit();
      // Close the modal
      this.recipientsModal.hide();
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors de l\'enregistrement des destinataires.');
    });
  }

  /**
   * Check if an email is valid and return true if so
   * @param {string} email Email to be checked
   */
  isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
