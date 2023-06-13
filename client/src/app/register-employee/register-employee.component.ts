import { Component } from '@angular/core';
import { Employee } from '../_models/employee';
import { EmployeeService } from '../_services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent {
  user: Employee = new Employee();

  constructor(private employeeService: EmployeeService, private toastr: ToastrService) {}

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
