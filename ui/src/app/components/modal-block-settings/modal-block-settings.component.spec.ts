import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBlockSettingsComponent } from './modal-block-settings.component';

describe('ModalBlockSettingsComponent', () => {
  let component: ModalBlockSettingsComponent;
  let fixture: ComponentFixture<ModalBlockSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBlockSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBlockSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
