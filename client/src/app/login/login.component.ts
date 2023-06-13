import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Employee } from '../_models/employee';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (user: Employee) => {
        this.authService.setLoggedIn(true);
        this.router.navigate(['/dashboard']);
        this.toastr.success('Login successful!');
      },
      (error) => {
        this.toastr.error('Login Failed!');
      }
    );
  }
}
