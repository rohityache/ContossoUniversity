// user-dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../Layout/header/header.component';
import { FooterComponent } from '../../../Layout/footer/footer.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
