import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

// Custom
import { ApiService } from '../../services/api.service';
import { LangSelected } from '../../models/lang';

import { languagesList } from './../../data/lang';

@Component({
  selector: 'app-page-campaign-options',
  templateUrl: './page-campaign-options.component.html',
  styleUrls: ['./page-campaign-options.component.scss']
})
export class PageCampaignOptionsComponent implements OnInit {

  brandName: string;
  campaignName: string;
  breadcrumbs: Array<{title: string, path: string}>;
  languages: LangSelected[];

  // Options de la campagne
  campaignOptions: any;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
    this.languages = <LangSelected[]>languagesList.map(lang => {
      const langSelected = <LangSelected>lang;
      langSelected.selected = false;
      return langSelected;
    });
  }

  public languagesSelected = () => {
    return this.languages.filter(lang => lang.selected);
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
      console.log(this.campaignOptions);
    });
  }

  onCheckBoxChange(language: any) {
    console.log('onCheckBoxChange');
    language.selected = !language.selected;
  }

  onOptionsFormSubmit(form: NgForm) {
    if (form.valid) {
      console.log('form.value', form.value);

      const campaignName = form.value.campaignName;
      delete form.value['campaignName'];

      const lang = {};

      Object.keys(form.value).forEach((key) => {
        const langCode = key.substr(key.length - 2);
        lang[langCode] = {
          subject: form.value[key]
        };
      });

      console.log(lang);

      this.campaignOptions.lang = lang;

      console.log(this.campaignOptions);

      // this.gotoBuilder();
    }
  }

  onNewLangFormSubmit(form: NgForm) {
    if (form.valid) {
      // Check if a lang with the same code already exists
      if (this.languages.filter(lang => lang.code === form.value.code).length > 0) {
        form.controls['code'].setErrors({'incorrect': true});
      } else {
        this.languages.push({
          name: form.value.name,
          code: form.value.code,
          selected: true
        });
        form.reset();
      }
    }
  }

  gotoBuilder() {
    this.router.navigate([`/brands/${this.brandName}/campaigns/${this.campaignName}/builder`]);
  }

}
