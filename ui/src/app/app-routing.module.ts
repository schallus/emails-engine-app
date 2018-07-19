import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageBrandsComponent } from './components/page-brands/page-brands.component';
import { PageCampaignsComponent } from './components/page-campaigns/page-campaigns.component';
import { PageCampaignOptionsComponent } from './components/page-campaign-options/page-campaign-options.component';
import { PageCampaignBuilderComponent } from './components/page-campaign-builder/page-campaign-builder.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: 'brands',
    component: PageBrandsComponent,
    data: { title: 'Marques', step: 0 }
  },
  {
    path: 'brands/:brandName/campaigns',
    component: PageCampaignsComponent,
    data: {
      title: 'Campagnes',
      step: 1
    },
  },
  {
    path: 'brands/:brandName/campaigns/:campaignName/options',
    component: PageCampaignOptionsComponent,
    data: {
      title: 'Options',
      step: 2
    },
  },
  {
    path: 'brands/:brandName/campaigns/options',
    component: PageCampaignOptionsComponent,
    data: {
      title: 'Options',
      step: 2
    },
  },
  {
    path: 'brands/:brandName/campaigns/:campaignName/builder',
    component: PageCampaignBuilderComponent,
    data: {
      title: 'Editeur d\'email',
      step: 3
    },
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '', redirectTo: '/brands', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
