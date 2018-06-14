import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCampaignsComponent } from './page-campaigns.component';

describe('PageCampaignsComponent', () => {
  let component: PageCampaignsComponent;
  let fixture: ComponentFixture<PageCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
