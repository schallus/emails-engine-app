import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  steps: Array<{ name: string, route: any[], icon?: string }>;

  currentStep: number;
  brandName: string;
  campaignName: string;

  constructor(private router: Router) { 
    this.currentStep = 0;
  }

  /**
   * Function called on the component initialization which goal is to update 
   * the stepper data everytime the route changes
   */
  ngOnInit() {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        const activatedRoute = data.state.root.firstChild;
        this.brandName = activatedRoute.params.brandName;
        this.campaignName = activatedRoute.params.campaignName;
        this.currentStep = activatedRoute.data.step;
        this.steps = [
          { name: 'Marques', route: ['brands']},
          { name: 'Campagnes', route: ['brands', this.brandName, 'campaigns']},
          { name: 'Options', route: ['brands', this.brandName, 'campaigns', this.campaignName, 'options'], icon: 'fa-cog' },
          { name: 'Design', route: ['brands', this.brandName, 'campaigns', this.campaignName, 'builder'], icon: 'fa-download' }
        ];
      }
    });
  }

}
