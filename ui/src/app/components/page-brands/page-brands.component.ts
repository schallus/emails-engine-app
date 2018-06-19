import { Component, OnInit } from '@angular/core';
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

  filterBrand: string;
  filterBrandControl = new FormControl();
  formCtrlSub: Subscription;
  breadcrumbs: Array<{title: string, path: string}>;
  brands: Brand[];
  filteredBrands: Brand[];

  constructor(private apiService: ApiService) {
    this.breadcrumbs = [
      { title: 'Marques', path: '/brands' }
    ];

    /*this.brands = [
      {
        name: 'nespresso',
        displayName: 'Nespresso',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Nespresso-logo.svg/320px-Nespresso-logo.svg.png'
      },
      {
        name: 'tagheuer',
        displayName: 'Tag Heuer',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/TAG_HEUER_logo.svg/500px-TAG_HEUER_logo.svg.png'
      }
    ];*/

    this.apiService.getBrands().subscribe(brands => {
      this.brands = brands;
      this.filteredBrands = this.brands;
    });

    this.filterBrand = '';
  }

  ngOnInit() {
    // debounce keystroke events
    this.formCtrlSub = this.filterBrandControl.valueChanges
      .debounceTime(500)
      .subscribe(newValue => {
        this.filterBrand = newValue;
        console.log('filterChanged', this.filterBrand);
        this.filterBrands();
      });
  }

  filterBrands() {
    this.filteredBrands = this.brands.filter(brand => brand.displayName.toLowerCase().indexOf(this.filterBrand.toLowerCase()) > -1);
  }

}
