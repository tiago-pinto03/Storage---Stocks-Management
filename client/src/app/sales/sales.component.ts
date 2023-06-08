import { Component, OnInit } from '@angular/core';
import { Sales } from '../_models/sales';
import { SalesService } from '../_services/sales.service';

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

  constructor(private salesService: SalesService) { }

  ngOnInit(): void {
    this.getSales();
  }

  getSales(): void {
    this.salesService.getSales()
      .subscribe(
        sales => {
          this.sales = sales;
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
          }
        );
    }
  }

  onEditClick(sale: Sales) {
    this.showEditSales = true;
    this.editedSale = { ...sale };
  }

  addSale() {
    if (this.newSale) {
      this.salesService.addSale(this.newSale).subscribe(() => {
        this.getSales();
        this.cancelAdd();
      });
    }
  }

  cancelAdd() {
    this.showAddSale = false;
    this.newSale = {};
  }

}
