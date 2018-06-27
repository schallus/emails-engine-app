import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { Campaign } from '../../models/campaign';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-page-campaigns',
  templateUrl: './page-campaigns.component.html',
  styleUrls: ['./page-campaigns.component.scss']
})
export class PageCampaignsComponent implements OnInit {

  @ViewChild('modalArchive') public modalArchive;
  @ViewChild('modalClone') public modalClone;
  @ViewChild('modalNew') public modalNew;

  filterCampaign: string;
  filterCampaignControl = new FormControl();
  formCtrlSub: Subscription;
  campaigns: Campaign[];
  filteredCampaigns: Campaign[];
  campaign: string;
  brandName: string;
  breadcrumbs: Array<{title: string, path: string}>;
  duplicateName: string;
  newCampaignName: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.filterCampaign = '';
    this.duplicateName = '';
    this.newCampaignName = '';
  }

  ngOnInit() {
    this.brandName = this.route.snapshot.paramMap.get('brandName');

    this.getCampaigns();

    this.breadcrumbs = [
      { title: 'Marques', path: '/brands' },
      { title: 'Campagnes', path: `/brands/${this.brandName}/campaigns` }
    ];

    // debounce keystroke events
    this.formCtrlSub = this.filterCampaignControl.valueChanges
      .debounceTime(500)
      .subscribe(newValue => {
        this.filterCampaign = newValue;
        console.log('filterChanged', this.filterCampaign);
        this.filterCampaigns();
      });
  }

  getCampaigns(cb?: () => void) {
    this.apiService.getCampaigns(this.brandName).subscribe(campaigns => {
      this.campaigns = campaigns;
      this.filteredCampaigns = this.campaigns;
      if (cb) {
        cb();
      }
    });
  }

  filterCampaigns() {
    this.filteredCampaigns = this.campaigns.filter(campaign => campaign.displayName.toLowerCase()
      .indexOf(this.filterCampaign.toLowerCase()) > -1);
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
    this.apiService.archiveCampaign(this.brandName, campaignName).subscribe(() => {
      this.getCampaigns(() => this.modalArchive.hide());
    });
  }

  deleteCampaign(campaignName: string) {
    this.apiService.deleteCampaign(this.brandName, campaignName).subscribe(() => {
      this.getCampaigns(() => this.modalArchive.hide());
    });
  }

  cloneCampaign(campaignName: string) {
    this.apiService.duplicateCampaign(this.brandName, campaignName, this.duplicateName).subscribe(() => {
      this.duplicateName = '';
      this.getCampaigns(() => this.modalClone.hide());
    });
  }

  newCampaign() {
    this.apiService.addCampaign(this.brandName, this.newCampaignName).subscribe((newCampaign) => {
      this.newCampaignName = '';
      this.modalNew.hide();
      this.router.navigate(['/brands', this.brandName, 'campaigns', newCampaign.name, 'options']);
    });
  }
}
