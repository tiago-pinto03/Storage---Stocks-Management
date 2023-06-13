import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Employee } from '../_models/employee';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../_services/product.service';
import { SalesService } from '../_services/sales.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;

  loggedInEmployee: Employee | null = null;
  employees: Employee[] = [];
  salesChartData: any;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private productService: ProductService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInEmployee().subscribe(
      (employee: Employee | null) => {
        this.loggedInEmployee = employee;
        console.log('Logged-in Employee:', this.loggedInEmployee);
      },
      (error) => {
        console.log('Error:', error);
        this.toastr.error('Erro!', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.generateSalesChart();
  }

  generateSalesChart(): void {
    this.salesService.getSales().subscribe(
      (sales) => {
        const aggregatedData: { [productName: string]: number } = {};

        sales.forEach((sale: any) => {
          const productName = sale.product?.name;
          const quantity = sale.quantity;

          if (productName && quantity) {
            if (aggregatedData[productName]) {
              aggregatedData[productName] += quantity;
            } else {
              aggregatedData[productName] = quantity;
            }
          }
        });

        const chartLabels = Object.keys(aggregatedData);
        const chartData = Object.values(aggregatedData);

        this.salesChartData = new Chart(this.salesChartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: chartLabels,
            datasets: [
              {
                label: 'Quantidade de Vendas',
                data: chartData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          } as any
        });
      },
      (error) => {
        console.log('Error getting sales:', error);
        this.toastr.error('Erro!', error);
      }
    );
  }


}
