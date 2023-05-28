import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isLoggedIn: boolean = false;
  private tokenKey = '';

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authService.logout();
  }
}
