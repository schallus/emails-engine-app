import { Component, OnInit, ViewChild } from '@angular/core';
import { Brand } from '../../models/brand';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-page-brands',
  templateUrl: './page-brands.component.html',
  styleUrls: ['./page-brands.component.scss']
})
export class PageBrandsComponent implements OnInit {

  @ViewChild('recipientsModal') recipientsModal;
  breadcrumbs: Array<{title: string, path: string}>;
  brands: Brand[];
  brand: Brand;
  filteredBrands: Brand[];

  constructor(private apiService: ApiService) {
    this.breadcrumbs = [
      { title: 'Marques', path: '/brands' }
    ];

    this.apiService.getBrands().subscribe(brands => {
      this.brands = brands;
      this.filteredBrands = this.brands;
    });
  }

  ngOnInit() {}
  
  filterBrands(event:any) {
    this.filteredBrands = this.brands.filter(brand => brand.displayName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
  }

  openRecipientsModal(brand: Brand) {
    this.brand = brand;
    this.recipientsModal.show();
  }

}
