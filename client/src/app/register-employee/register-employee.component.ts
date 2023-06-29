import { Component, OnInit } from '@angular/core';
import { Employee } from '../_models/employee';
import { EmployeeService } from '../_services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit{
  user: Employee = new Employee();
  loggedInEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService, private toastr: ToastrService, private authService: AuthService) {}

  ngOnInit(){ this.authService.getLoggedInEmployee().subscribe(
    (employee: Employee | null) => {
      this.loggedInEmployee = employee;
      console.log('Logged-in Employee:', this.loggedInEmployee);
    },
    (error) => {
      console.log('Error:', error);
      this.toastr.error('Erro!', error);
    }
  );}

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      this.toastr.error('Passwords não coincidem!');
      console.error('Passwords do not match');
      return;
    }
    this.employeeService.registerEmployee(this.user)
      .subscribe(
        (response) => {
          this.toastr.success('Funcionário registado com sucesso!');
          console.log('Registration successful');
        },
        (error) => {
          this.toastr.error('Erro ao registar Funcionário!');
          console.error('Registration failed', error);
        }
      );
  }
}
