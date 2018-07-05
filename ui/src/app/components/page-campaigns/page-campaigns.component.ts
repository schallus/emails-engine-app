import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { ApiService } from '../../services/api.service';
import { ToastService } from 'ng-uikit-pro-standard';

// Models
import { Campaign } from '../../models/campaign';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-page-campaigns',
  templateUrl: './page-campaigns.component.html',
  styleUrls: ['./page-campaigns.component.scss']
})
export class PageCampaignsComponent implements OnInit {

  @ViewChild('modalArchive') public modalArchive;
  @ViewChild('modalClone') public modalClone;
  @ViewChild('modalNew') public modalNew;

  campaigns: Campaign[];
  filteredCampaigns: Campaign[];
  filtered: boolean;
  campaign: string;
  brand: Brand;
  breadcrumbs: Array<{title: string, path?: string}>;
  duplicateName: string;
  newCampaignName: string;
  private sorted = false;
  itemsPerPage: number = 5;
  numberOfPage: number;
  pageActive: number;

  Arr = Array;

  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService, 
    private router: Router,
    private toastrService: ToastService
  ) {
    this.duplicateName = '';
    this.newCampaignName = '';
    this.filtered = false;
  }

  ngOnInit() {
    const brandName = this.route.snapshot.paramMap.get('brandName');

    this.apiService.getBrands().subscribe(brands => {
      if(brands.map(el => el.name).indexOf(brandName) == -1) {
        this.redirect404();
      } else {
        this.brand = brands.filter(el => el.name == brandName)[0];

        this.getCampaigns();

        this.breadcrumbs = [
          { title: 'Marques', path: `/brands` },
          { title: this.brand.displayName, path: `/brands/${this.brand.name}/campaigns` },
          { title: 'Campagnes' },
        ];
      }
    });
  }

  sortBy(array: any[], by: string | any): void {
    array.sort((a: any, b: any) => {
      if (a[by].toLowerCase() < b[by].toLowerCase()) {
        return this.sorted ? 1 : -1;
      }
      if (a[by].toLowerCase() > b[by].toLowerCase()) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });
    this.sorted = !this.sorted;
  }

  getCampaigns(cb?: () => void) {
    this.apiService.getCampaigns(this.brand.name).subscribe(campaigns => {
      this.campaigns = campaigns;
      this.sortBy(this.campaigns, 'displayName');
      this.numberOfPage = Math.ceil(this.campaigns.length / this.itemsPerPage);
      this.setPage(1);
      if (cb) {
        cb();
      }

    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des campagnes.');
    });
  }

  setPage(pageNumber: number) {
    this.filteredCampaigns = this.campaigns;
    this.filteredCampaigns = this.filteredCampaigns.slice((pageNumber-1)*this.itemsPerPage, pageNumber*this.itemsPerPage);
    this.pageActive = pageNumber;
  }

  filterCampaigns(event: any) {
    if (event.target.value) {
      this.filtered = true;
      this.filteredCampaigns = this.campaigns.filter(
        campaign => campaign.displayName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
      );
    } else {
      this.filtered = false;
      this.setPage(1);
    }
  }

  showArchiveConfirmation(campaign: string) {
    this.campaign = campaign;
    this.modalArchive.show();
  }

  showCloneConfirmation(campaign: string) {
    this.campaign = campaign;
    this.modalClone.show();
  }

  archiveCampaign(campaignName: string) {
    this.apiService.archiveCampaign(this.brand.name, campaignName).subscribe(() => {
      this.getCampaigns(() => this.modalArchive.hide());
    }, err => {
      this.modalArchive.hide();
      this.toastrService.error('Une erreur s\'est produite lors de l\'archivage de la campagne.');
    });
  }

  deleteCampaign(campaignName: string) {
    this.apiService.deleteCampaign(this.brand.name, campaignName).subscribe(() => {
      this.getCampaigns(() => this.modalArchive.hide());
    }, err => {
      this.modalArchive.hide();
      this.toastrService.error('Une erreur s\'est produite lors de la suppression de la campagne.');
    });
  }

  cloneCampaign(campaignName: string) {
    this.apiService.duplicateCampaign(this.brand.name, campaignName, this.duplicateName).subscribe(() => {
      this.duplicateName = '';
      this.getCampaigns(() => this.modalClone.hide());
    }, err => {
      this.modalClone.hide();
      this.toastrService.error('Une erreur s\'est produite lors de la duplication de la campagne.');
    });
  }

  newCampaign() {
    this.apiService.addCampaign(this.brand.name, this.newCampaignName).subscribe((newCampaign) => {
      this.newCampaignName = '';
      this.modalNew.hide();
      this.router.navigate(['/brands', this.brand.name, 'campaigns', newCampaign.name, 'options']);
    }, err => {
      this.modalNew.hide();
      this.toastrService.error('Une erreur s\'est produite lors de l\'ajout de la campagne.');
    });
  }

  redirect404 = () => {
    this.router.navigate([`/404`]);
  }
}
