import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

//Data
import { languagesList } from './../../data/lang';

// Services
import { ToastService } from 'ng-uikit-pro-standard';
import { ApiService } from '../../services/api.service';

// Models
import { LangSelected } from '../../models/lang';
import { CampaignOptions } from '../../models/campaign-options';

@Component({
  selector: 'app-page-campaign-options',
  templateUrl: './page-campaign-options.component.html',
  styleUrls: ['./page-campaign-options.component.scss']
})
export class PageCampaignOptionsComponent implements OnInit {

  brandName: string;
  campaignName: string;
  campaignDisplayName: string;
  breadcrumbs: Array<{title: string, path: string}>;
  languages: LangSelected[];
  filteredLanguages: LangSelected[];
  campaignOptions: CampaignOptions;

  masterLang: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastService
  ) {
    this.languages = <LangSelected[]>languagesList.map(lang => {
      const langSelected = <LangSelected>lang;
      langSelected.selected = false;
      return langSelected;
    });
  }

  ngOnInit() {
    this.brandName = this.route.snapshot.paramMap.get('brandName');
    this.campaignName = this.route.snapshot.paramMap.get('campaignName');

    this.breadcrumbs = [
      { title: 'Marques', path: '/brands' },
      { title: 'Campagnes', path: `/brands/${this.brandName}/campaigns` },
      { title: 'Options', path: `/brands/${this.brandName}/campaigns/${this.campaignName}/options` },
    ];

    // Get campaign options
    this.apiService.getCampaignOptions(this.brandName, this.campaignName).subscribe(options => {
      this.campaignOptions = options;

      this.languages = this.languages.concat(this.campaignOptions.customLang.map(lang => {
        const langSelected = <LangSelected>lang;
        langSelected.selected = true;
        return langSelected;
      }));

      this.filteredLanguages = this.languages;

      this.masterLang = this.campaignOptions.masterLang;

      Object.keys(this.campaignOptions.lang).forEach((key) => {
        const lang = this.languages.filter(el => el.code === key);
        if (lang.length > 0) {
          lang[0].selected = true;
        } else {
          console.log('la langue ' + key + ' n\'existe pas ');
        }
      });
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des options.');
    });

    this.apiService.getCampaigns(this.brandName).subscribe(campaigns => {
      this.campaignDisplayName = campaigns.filter(campaign => campaign.name === this.campaignName)[0].displayName;
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement de la campagne.');
    });
  }

  onCheckBoxChange = (language: LangSelected) => {
    language.selected = !language.selected;

    // If it's a custom language, we remove it
    if (!language.selected && languagesList.filter((el) => el.code === language.code).length < 1) {
      this.campaignOptions.customLang = this.campaignOptions.customLang.filter((el) => el.code !== language.code);
      this.languages = this.languages.filter((el) => el.code !== language.code);
    }
  }

  onOptionsFormSubmit = (form: NgForm) => {
    if (form.valid) {
      const campaignDisplayName = form.value.campaignDisplayName;
      this.campaignOptions.masterLang = form.value.masterLang;
      this.masterLang = form.value.masterLang;

      // masterLang is undefined when we remove a lang and submit the form : to be fixed !!

      this.apiService.editCampaign(this.brandName, this.campaignName, campaignDisplayName).subscribe(() => {}, err => {
        this.toastrService.error('Une erreur s\'est produite lors de l\'édition de la campagne.');
      });

      const lang = {};

      // duplicate the object
      const subjects = Object.assign({}, form.value);
      delete subjects['campaignName'];
      delete subjects['campaignDisplayName'];
      delete subjects['masterLang'];

      Object.keys(subjects).forEach((key) => {
        const langCode = key.substr(key.length - 2);
        lang[langCode] = {
          subject: form.value[key]
        };
      });

      this.campaignOptions.lang = lang;

      this.apiService.setCampaignOptions(this.brandName, this.campaignName, this.campaignOptions).subscribe(options => {
        // On success, go to builder page
        this.gotoBuilder();
      }, err => {
        this.toastrService.error('Une erreur s\'est produite lors de l\'enregistrement des options.');
      });
    }
  }

  onNewLangFormSubmit = (form: NgForm) => {
    if (form.valid) {
      // Check if a lang with the same code already exists
      if (this.languages.filter(lang => lang.code === form.value.code).length > 0) {
        // diplay the error with toastr
        // this.toastrService.showError('Une langue avec le même code existe déjà.', 'Erreur');
        form.controls['code'].setErrors({'incorrect': true});
      } else {
        this.languages.push({
          name: form.value.name,
          code: form.value.code,
          selected: true
        });
        this.campaignOptions.customLang.push({
          name: form.value.name,
          code: form.value.code
        });
        form.reset();
      }
    }
  }

  getLanguagesSelected = () => {
    return this.languages.filter(lang => lang.selected);
  }

  getSubject = (languageCode: string): string => {
    if (this.campaignOptions.lang[languageCode]) {
      return this.campaignOptions.lang[languageCode].subject;
    } else {
      return '';
    }
  }

  filterLanguages = (event:any) => {
    this.filteredLanguages = this.languages.filter(
      lang => lang.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
    );
  }

  gotoBuilder = () => {
    this.router.navigate([`/brands/${this.brandName}/campaigns/${this.campaignName}/builder`]);
  }

}
