import { Component, OnInit } from '@angular/core';
import { Sales } from '../_models/sales';
import { SalesService } from '../_services/sales.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private salesService: SalesService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getSales();
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

  updateSales() {
    this.salesService.updateSales(this.editedSale)
      .subscribe(
        () => {
          this.updateSuccess = true;
          this.showEditSales = false;
          this.getSales();
        },
        (error) => {
          console.error(error);
          this.toastr.error('Erro ao atualizar venda!', error);
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
    if (!this.newSale.product) {
      this.newSale.product = {};
    }
    this.newSale.product.id = productId;
  }

  updateClientId(clientId: string): void {
    if (!this.newSale.client) {
      this.newSale.client = {name: '', nif: 0, email: ''};
    }
    this.newSale.client.id = clientId;
  }

  updateEmployeeId(employeeId: string): void {
    if (!this.newSale.employee) {
      this.newSale.employee = {token:''};
    }
    this.newSale.employee.id = employeeId;
  }


  addSale(): void {
    this.salesService.addSale(this.newSale).subscribe(
      (addedSale) => {
        this.sales.push(addedSale);
        this.newSale = {};
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
