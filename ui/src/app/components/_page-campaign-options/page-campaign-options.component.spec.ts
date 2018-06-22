import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCampaignOptionsComponent } from './page-campaign-options.component';

describe('PageCampaignOptionsComponent', () => {
  let component: PageCampaignOptionsComponent;
  let fixture: ComponentFixture<PageCampaignOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCampaignOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCampaignOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
