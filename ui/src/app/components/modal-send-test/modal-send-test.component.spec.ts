import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendTestComponent } from './modal-send-test.component';

describe('ModalSendTestComponent', () => {
  let component: ModalSendTestComponent;
  let fixture: ComponentFixture<ModalSendTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSendTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
