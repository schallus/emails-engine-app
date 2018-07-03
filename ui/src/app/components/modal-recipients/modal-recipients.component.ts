import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-modal-recipients',
  templateUrl: './modal-recipients.component.html',
  styleUrls: ['./modal-recipients.component.scss']
})
export class ModalRecipientsComponent implements OnInit {

  @ViewChild('recipientsModal') recipientsModal;
  
  @Input() brand: Brand;
  @Input() config: Brand;
  constructor() { }

  ngOnInit() { }

  show() {
    this.recipientsModal.show();
  }

}
