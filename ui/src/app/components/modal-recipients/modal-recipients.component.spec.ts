import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecipientsComponent } from './modal-recipients.component';

describe('ModalRecipientsComponent', () => {
  let component: ModalRecipientsComponent;
  let fixture: ComponentFixture<ModalRecipientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRecipientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
