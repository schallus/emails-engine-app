import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { AppRoutingModule } from './app-routing.module';
import { SortablejsModule } from 'angular-sortablejs';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { QuillModule } from 'ngx-quill';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AppComponent } from './app.component';

import { PageBrandsComponent } from './components/page-brands/page-brands.component';
import { PageCampaignsComponent } from './components/page-campaigns/page-campaigns.component';
import { PageCampaignOptionsComponent } from './components/page-campaign-options/page-campaign-options.component';
import { PageCampaignBuilderComponent } from './components/page-campaign-builder/page-campaign-builder.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { StepperComponent } from './components/stepper/stepper.component';

import { ModalRecipientsComponent } from './components/modal-recipients/modal-recipients.component';
import { ModalSendTestComponent } from './components/modal-send-test/modal-send-test.component';
import { ModalBlockSettingsComponent } from './components/modal-block-settings/modal-block-settings.component';

import { FilterSelectedPipe } from './pipes/filter-selected.pipe';
import { FilterPipe } from './pipes/filter.pipe';

import { ApiService } from './services/api.service';
import { ApiHelperService } from './services/api-helper.service';
import { UploadService } from './services/upload.service';

import { DebounceChangeDirective } from './directives/debounce-change.directive';
import { NgForIn } from './directives/ng-for-in.directive';

@NgModule({
  declarations: [
    AppComponent,
    PageBrandsComponent,
    PageCampaignsComponent,
    PageCampaignOptionsComponent,
    PageCampaignBuilderComponent,
    PageNotFoundComponent,
    StepperComponent,
    ModalRecipientsComponent,
    ModalSendTestComponent,
    ModalBlockSettingsComponent,
    FilterSelectedPipe,
    FilterPipe,
    DebounceChangeDirective,
    NgForIn
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    AppRoutingModule,
    SortablejsModule.forRoot({}),
    HttpClientModule,
    ColorPickerModule,
    QuillModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [ApiService, ApiHelperService, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
