import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';

@Component({
  selector: 'app-page-campaign-options',
  templateUrl: './page-campaign-options.component.html',
  styleUrls: ['./page-campaign-options.component.scss']
})
export class PageCampaignOptionsComponent implements OnInit {

  private brandName: string;
  private campaignName: string;
  private breadcrumbs: Array<{title: string, path: string}>;
  private languages: Array<{title: string, abbr: string, selected: boolean}>;
  newLangForm: FormGroup;
  // campaignOptionsForm: FormGroup;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    this.newLangForm = formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      abbr: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
    });

    /*this.campaignOptionsForm = formBuilder.group({
      campaignName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      subjectfr: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      subjectit: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });*/

    this.languages = [
      { title: 'Français', abbr: 'fr', selected: true },
      { title: 'Allemand', abbr: 'de', selected: false },
      { title: 'Italien', abbr: 'it', selected: true },
      { title: 'Anglais', abbr: 'en', selected: false }
    ];
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
  }

  addNewLang() {
    if (this.newLangForm.dirty && this.newLangForm.valid) {
      const newLang = { title: this.newLangForm.value.title, abbr: this.newLangForm.value.abbr, selected: true };
      this.languages.push(newLang);
    }
  }

  onOptionsSubmit(form: NgForm) {
    console.log('form', form);
    console.log('form value', form.value);
    if (form.valid) {
      console.log('form is valid');
    }
    this.gotoBuilder();
  }

  gotoBuilder() {
    this.router.navigate([`/brands/${this.brandName}/campaigns/${this.campaignName}/builder`]);
  }

}
