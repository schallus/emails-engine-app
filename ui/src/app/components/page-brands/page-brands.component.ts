import { Component, OnInit, ViewChild } from '@angular/core';

// Services
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiService } from '../../services/api.service';

// Models
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-page-brands',
  templateUrl: './page-brands.component.html',
  styleUrls: ['./page-brands.component.scss']
})
export class PageBrandsComponent implements OnInit {

  @ViewChild('recipientsModal') recipientsModal;

  brands: Brand[];
  filteredBrands: Brand[];

  constructor(
    private apiService: ApiService,
    private toastrService: ToastService
  ) {
    this.apiService.getBrands().subscribe(brands => {
      this.brands = brands;
      this.filteredBrands = this.brands;
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des marques.');
    });
  }

  /**
   * Function called on the component initialization
   */
  ngOnInit() {}
  
  /**
   * Filter the brands when we type in the search input
   * @param {any} event Event that contain the filter input data
   */
  filterBrands(event:any) {
    this.filteredBrands = this.brands.filter(
      brand => brand.displayName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
    );
  }

}
