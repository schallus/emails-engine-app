import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBrandsComponent } from './page-brands.component';

describe('PageBrandsComponent', () => {
  let component: PageBrandsComponent;
  let fixture: ComponentFixture<PageBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
