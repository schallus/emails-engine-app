import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCampaignBuilderComponent } from './page-campaign-builder.component';

describe('PageCampaignBuilderComponent', () => {
  let component: PageCampaignBuilderComponent;
  let fixture: ComponentFixture<PageCampaignBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCampaignBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCampaignBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
