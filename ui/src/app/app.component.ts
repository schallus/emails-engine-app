import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Email Engine';

  public constructor(private route:ActivatedRoute) {
    console.log(this.route.snapshot.data['step']);
  }
}
