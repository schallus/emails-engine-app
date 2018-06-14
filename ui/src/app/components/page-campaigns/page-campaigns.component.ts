import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  filterCampaign: string;
  filterCampaignControl = new FormControl();
  formCtrlSub: Subscription;
  campaigns: Campaign[];
  filteredCampaigns: Campaign[];
  campaign: string;
  brandName: string;
  breadcrumbs: Array<{title: string, path: string}>;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    /*this.campaigns = [
      {
        name: 'nouvelle-collection-ete',
        displayName: 'Nouvelle collection été',
        createdAt: new Date()
      },
      {
        name: 'my-second-campaign',
        displayName: 'My second campaign',
        createdAt: new Date()
      },
      {
        name: 'campaign-test',
        displayName: 'Campaign test',
        createdAt: new Date()
      }
    ];*/

    this.filterCampaign = '';
  }

  ngOnInit() {
    this.brandName = this.route.snapshot.paramMap.get('brandName');

    this.apiService.getCampaigns(this.brandName).subscribe(campaigns => {
      this.campaigns = campaigns;
      this.filteredCampaigns = this.campaigns;
    });

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

  filterCampaigns() {
    // tslint:disable-next-line:max-line-length
    this.filteredCampaigns = this.campaigns.filter(campaign => campaign.displayName.toLowerCase().indexOf(this.filterCampaign.toLowerCase()) > -1);
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
    console.log('archiveCampaign', campaignName);
  }

  cloneCampaign(campaignName: string, newCampaignName: string) {
    console.log(`clone campaign '${campaignName}' / new name : '${newCampaignName}'`);
  }

}
