import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Employee } from '../_models/employee';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loggedInEmployee: Employee | null = null;
  employees: Employee[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLoggedInEmployee().subscribe(
      (employee: Employee | null) => {
        this.loggedInEmployee = employee;
        console.log('Logged-in Employee:', this.loggedInEmployee);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
