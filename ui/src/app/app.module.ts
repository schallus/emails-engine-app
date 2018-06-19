import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { AppRoutingModule } from './app-routing.module';
import { SortablejsModule } from 'angular-sortablejs';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
// import { JoditAngularModule } from 'jodit-angular';

import { AppComponent } from './app.component';
import { PageBrandsComponent } from './components/page-brands/page-brands.component';
import { PageCampaignsComponent } from './components/page-campaigns/page-campaigns.component';
import { PageCampaignOptionsComponent } from './components/page-campaign-options/page-campaign-options.component';
import { PageCampaignBuilderComponent } from './components/page-campaign-builder/page-campaign-builder.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FilterSelectedPipe } from './pipes/filter-selected.pipe';
import { ApiService } from './services/api.service';
import { ToastrService } from './services/toastr.service';
import { ApiHelperService } from './services/api-helper.service';
import { DebounceChangeDirective } from './directives/debounce-change.directive';

@NgModule({
  declarations: [
    AppComponent,
    PageBrandsComponent,
    PageCampaignsComponent,
    PageCampaignOptionsComponent,
    PageCampaignBuilderComponent,
    PageNotFoundComponent,
    BreadcrumbComponent,
    FilterSelectedPipe,
    DebounceChangeDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    AppRoutingModule,
    SortablejsModule.forRoot({}),
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    ToastModule.forRoot(),
    // JoditAngularModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [ApiService, ApiHelperService, ToastrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
