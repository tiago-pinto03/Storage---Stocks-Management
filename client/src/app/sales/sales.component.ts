import { Component, OnInit } from '@angular/core';
import { Sales } from '../_models/sales';
import { SalesService } from '../_services/sales.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';
import { EmployeeService } from '../_services/employee.service';
import { Employee } from '../_models/employee';
import { ClientService } from '../_services/client.service';
import { Client } from '../_models/client';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  sales: Sales[] = [];
  showEditSales: boolean = false;
  updateSuccess: boolean = false;
  editedSale: Sales = {};
  showAddSale = false;
  newSale: Partial<Sales> = {};
  products: Product[] = [];
  employees: Employee[] = [];
  clients: Client[] = [];
  selectedProduct: string = '';
  selectedEmployee: string = '';
  selectedClient: string = '';

  constructor(private salesService: SalesService, private productService: ProductService,
     private emplyeeService: EmployeeService, private toastr: ToastrService, private clientService: ClientService) { }

  ngOnInit(): void {
    this.getSales();
    this.getProducts();
    this.getEmployees();
    this.getClients();
  }

  getClients(): void {
    const loggedInEmployee = localStorage.getItem('loggedInEmployee');
    if (loggedInEmployee) {
      const loggedInUser = JSON.parse(loggedInEmployee);
      const token = loggedInUser.token;
      if (token) {
        this.clientService.getClients(token).subscribe(
          (client) => {
            this.clients = client;
          },
          (error) => {
            console.log('Error retrieving clients:', error);
          }
        );
      } else {
        console.log('Token is null');
      }
    } else {
      console.log('loggedInUserStr is null');
    }
  }

  getEmployees(): void {
    const loggedInEmployee = localStorage.getItem('loggedInEmployee');
    if (loggedInEmployee) {
      const loggedInUser = JSON.parse(loggedInEmployee);
      const token = loggedInUser.token;
      if (token) {
        this.emplyeeService.getEmployees(token).subscribe(
          (employees) => {
            this.employees = employees;
          },
          (error) => {
            console.log('Error retrieving employees:', error);
            this.toastr.error('Erro ao carregar funcionarios!', error);
          }
        );
      } else {
        console.log('Token is null');
      }
    } else {
      console.log('loggedInUserStr is null');
    }
  }

  getProducts(): void {
    const loggedInEmployee = localStorage.getItem('loggedInEmployee');
    if (loggedInEmployee) {
      const loggedInUser = JSON.parse(loggedInEmployee);
      const token = loggedInUser.token;
      if (token) {
        this.productService.getProducts(token).subscribe(
          (products) => {
            this.products = products;
          },
          (error) => {
            console.log('Error retrieving products:', error);
            this.toastr.error('Erro ao carregar produtos!', error);
          }
        );
      } else {
        console.log('Token is null');
      }
    } else {
      console.log('loggedInUserStr is null');
    }
  }

  getSales(): void {
    this.salesService.getSales()
      .subscribe(
        sales => {
          this.sales = sales;
        },
        (error) => {
          console.error(error);
          this.toastr.error('Erro ao carregar vendas!', error);
        }
      );
  }

  updateSales(): void {
    debugger
    this.salesService.updateSales(this.editedSale).subscribe(
      () => {
        const index = this.sales.findIndex(sale => sale.id === this.editedSale.id);
        if (index !== -1) {
          this.sales[index] = { ...this.editedSale };
        }
        this.updateSuccess = true;
        this.showEditSales = false;

        const loggedInEmployee = localStorage.getItem('loggedInEmployee');
        if (loggedInEmployee) {
          const loggedInUser = JSON.parse(loggedInEmployee);
          const token = loggedInUser.token;
          if (token) {
            this.productService.getProducts(token).subscribe(
              (products) => {
                const updatedProduct = products.find(product => product.id === this.editedSale?.product?.id);
                if (updatedProduct && updatedProduct.quantity && updatedProduct.quantity < 50) {
                  this.toastr.warning('AVISO: Quantidade abaixo de 50');
                }
                this.toastr.success('Venda Atualizada!');
              },
              (error) => {
                console.error(error);
                this.toastr.error('Erro ao obter produtos!');
              }
            );
          }
        }
      },
      (error) => {
        console.error(error);
        this.toastr.error('Erro ao atualizar venda!');
      }
    );
  }



  cancelEdit() {
    this.showEditSales = false;
    this.editedSale = {};
  }

  deleteSales(saleId: string | undefined) {
    if (!saleId) {
      return;
    }
    if (confirm('Deseja excluir a venda?')) {
      this.salesService.deleteSale(saleId)
        .subscribe(
          () => {
            this.getSales();
          },
          (error) => {
            console.error(error);
            this.toastr.error('Erro ao excluir venda!', error);
          }
        );
    }
  }

  onEditClick(sale: Sales) {
    this.showEditSales = true;
    this.editedSale = { ...sale };
  }

  updateProductId(productId: string): void {
    this.newSale.product = this.products.find(product => product.id === productId);
  }

  updateClientId(clientId: string): void {
    if (!this.newSale.client) {
      this.newSale.client = {name: '', nif: 0, email: ''};
    }
    this.newSale.client.id = clientId;
  }

  updateEmployeeId(employeeId: string): void {
    this.newSale.employee = this.employees.find(emp => emp.id === employeeId);
  }


  addSale(): void {
    this.salesService.addSale(this.newSale).subscribe(
      (addedSale) => {
        this.sales.push(addedSale);
        if (this.newSale.product && this.newSale.product.quantity && this.newSale.product.quantity < 50) {
          this.toastr.warning('AVISO: Quantidade abaixo de 50');
        }
        this.newSale = {};
        this.toastr.success('Venda adicionada com sucesso!');
      },
      (error) => {
        console.log('Error adding sale:', error);
        this.toastr.error('Erro ao adicionar venda!', error);
      }
    );
  }


  cancelAdd() {
    this.showAddSale = false;
    this.newSale = {};
  }

}
