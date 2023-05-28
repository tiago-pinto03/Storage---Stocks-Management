import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Employee } from '../_models/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (user: Employee) => {
        console.log('Logged in:', user);
        this.authService.setLoggedIn(true);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.log('Login failed:', error);
      }
    );
  }
}
