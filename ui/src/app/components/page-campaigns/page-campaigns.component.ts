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
  duplicateName: string;
  newCampaignName: string;
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

  /**
   * Function called on the component initialization
   */
  ngOnInit() {
    const brandName = this.route.snapshot.paramMap.get('brandName');

    this.apiService.getBrands().subscribe(brands => {
      if(brands.map(el => el.name).indexOf(brandName) == -1) {
        this.redirect404();
      } else {
        this.brand = brands.filter(el => el.name == brandName)[0];

        this.getCampaigns();
      }
    });
  }

  /**
   * Get the campaigns list from the API
   * @param {Function} cb Callback executed once the data retrieved from the API. (optional)
   */
  getCampaigns(cb?: () => void) {
    this.apiService.getCampaigns(this.brand.name).subscribe(campaigns => {
      campaigns.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.campaigns = campaigns;
      this.campaigns.map(campaign => {
        // Get campaign options
        this.apiService.getCampaignOptions(this.brand.name, campaign.name).subscribe(options => {
          campaign.languages = Object.keys(options.lang);
        });
      });
      this.numberOfPage = Math.ceil(this.campaigns.length / this.itemsPerPage);
      this.setPage(1);
      if (cb) {
        cb();
      }

    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des campagnes.');
    });
  }

  /**
   * Set the pagination page number and filter the campaigns to display in the specified page
   * @param {number} pageNumber Number of the page
   */
  setPage(pageNumber: number) {
    this.filteredCampaigns = this.campaigns;
    this.filteredCampaigns = this.filteredCampaigns.slice((pageNumber-1)*this.itemsPerPage, pageNumber*this.itemsPerPage);
    this.pageActive = pageNumber;
  }

  /**
   * Filter the campaign displayed by campaign display name
   * @param {any} event Event that contains the input value
   */
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

  /**
   * Show the archive / delete confirmation modal
   * @param {string} campaign Name of the campaign to archive or delete
   */
  showArchiveConfirmation(campaign: string) {
    this.campaign = campaign;
    this.modalArchive.show();
  }

  /**
   * Show the clone confirmation modal
   * @param {string} campaign Name of the campaign to be cloned
   */
  showCloneConfirmation(campaign: string) {
    this.campaign = campaign;
    this.modalClone.show();
  }

  /**
   * Archive a campaign
   * @param {string} campaignName Name of the campaign to archive
   */
  archiveCampaign(campaignName: string) {
    this.apiService.archiveCampaign(this.brand.name, campaignName).subscribe(() => {
      this.getCampaigns(() => this.modalArchive.hide());
    }, err => {
      this.modalArchive.hide();
      this.toastrService.error('Une erreur s\'est produite lors de l\'archivage de la campagne.');
    });
  }

  /**
   * Delete a campaign
   * @param {string} campaignName Name of the campaign to delete
   */
  deleteCampaign(campaignName: string) {
    this.apiService.deleteCampaign(this.brand.name, campaignName).subscribe(() => {
      this.getCampaigns(() => this.modalArchive.hide());
    }, err => {
      this.modalArchive.hide();
      this.toastrService.error('Une erreur s\'est produite lors de la suppression de la campagne.');
    });
  }

  /**
   * Clone a campaign
   * @param {string} campaignName Name of the campaign to be cloned
   */
  cloneCampaign(campaignName: string) {
    this.apiService.duplicateCampaign(this.brand.name, campaignName, this.duplicateName).subscribe(() => {
      this.duplicateName = '';
      this.getCampaigns(() => this.modalClone.hide());
    }, err => {
      this.modalClone.hide();
      this.toastrService.error('Une erreur s\'est produite lors de la duplication de la campagne.');
    });
  }

  /**
   * Create a new campaign and navigate to the options page
   */
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

  /**
   * Redirect the user to a '404 Page Not Found' page
   */
  redirect404 = () => {
    this.router.navigate([`/404`]);
  }
}
