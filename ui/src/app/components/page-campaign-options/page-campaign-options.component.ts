import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Brand } from '../../models/brand';
import { Campaign } from '../../models/campaign';

@Component({
  selector: 'app-page-campaign-options',
  templateUrl: './page-campaign-options.component.html',
  styleUrls: ['./page-campaign-options.component.scss']
})
export class PageCampaignOptionsComponent implements OnInit {

  brandName: string;
  brand: Brand;
  campaignName: string;
  campaign: Campaign;
  languages: LangSelected[];
  filteredLanguages: LangSelected[];
  campaignOptions: CampaignOptions;
  masterLang: string;

  @ViewChild('filterLangForm') public filterLangForm;

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
    const brandName = this.route.snapshot.paramMap.get('brandName');
    const campaignName = this.route.snapshot.paramMap.get('campaignName');

    this.apiService.getBrands().subscribe(brands => {
      if(brands.map(el => el.name).indexOf(brandName) == -1) {
        this.redirect404();
      } else {
        this.brand = brands.filter(el => el.name == brandName)[0];
        this.apiService.getCampaigns(this.brand.name).subscribe(campaigns => {
          if(campaigns.map(el => el.name).indexOf(campaignName) == -1) {
            this.redirect404();
          } else {
            this.campaign = campaigns.filter(el => el.name == campaignName)[0];

            // Get campaign options
            this.apiService.getCampaignOptions(this.brand.name, this.campaign.name).subscribe(options => {
              this.campaignOptions = options;

              this.languages = this.languages.concat(this.campaignOptions.customLang.map(lang => {
                const langSelected = <LangSelected>lang;
                langSelected.selected = true;
                return langSelected;
              }));

              this.sortLanguages();

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
          }
        }, err => {
          this.toastrService.error('Une erreur s\'est produite lors du chargement des campagnes.');
        });
      }
    }, err => {
      this.toastrService.error('Une erreur s\'est produite lors du chargement des marques.');
    });
  }

  sortLanguages = () => {
    this.languages.sort((a,b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
      return 0;
    });
  }

  onCheckBoxChange = (language: LangSelected) => {
    if(language.code !== this.masterLang) {
      language.selected = !language.selected;
      // If it's a custom language, we remove it
      if (!language.selected && languagesList.filter((el) => el.code === language.code).length < 1) {
        this.campaignOptions.customLang = this.campaignOptions.customLang.filter((el) => el.code !== language.code);
        this.languages = this.languages.filter((el) => el.code !== language.code);
        this.filteredLanguages = this.languages;
      }
    } else {
      this.toastrService.error('Vous ne pouvez pas supprimer la langue master.');
    }
  }

  onOptionsFormSubmit = (form: NgForm) => {
    if (form.valid) {
      if (this.campaign.displayName !== form.value.campaignDisplayName) {
        this.apiService.editCampaign(this.brand.name, this.campaign.name, form.value.campaignDisplayName).subscribe(() => {}, err => {
          this.toastrService.error('Une erreur s\'est produite lors de l\'édition de la campagne.');
        });
      }

      if (this.campaignOptions.masterLang=='') {
        this.campaignOptions.masterLang = form.value.masterLang;
        this.masterLang = form.value.masterLang;
      }

      // masterLang is undefined when we remove a lang and submit the form : to be fixed !!

      const lang = {};

      // duplicate the object
      const subjects = Object.assign({}, form.value);
      delete subjects['campaignName'];
      delete subjects['campaignDisplayName'];
      delete subjects['masterLang'];

      Object.keys(subjects).forEach((key) => {
        const langCode = key.substring(7, key.length);
        lang[langCode] = {
          subject: form.value[key]
        };
      });

      this.campaignOptions.lang = lang;

      this.apiService.setCampaignOptions(this.brand.name, this.campaign.name, this.campaignOptions).subscribe(options => {
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
      if (this.languages.filter(lang => lang.code.toLowerCase() === form.value.code.toLowerCase()).length > 0) {
        // diplay the error with toastr
        this.toastrService.error('Une langue avec le même code existe déjà.');
        form.controls['code'].setErrors({'incorrect': true});
      } else {
        this.languages.push({
          name: form.value.name,
          code: form.value.code,
          selected: true
        });
        this.sortLanguages();
        this.filteredLanguages = this.languages;
        this.campaignOptions.customLang.push({
          name: form.value.name,
          code: form.value.code
        });
        this.filterLangForm.reset();
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
    this.router.navigate([`/brands/${this.brand.name}/campaigns/${this.campaign.name}/builder`]);
  }

  redirect404 = () => {
    this.router.navigate([`/404`]);
  }

}
