import { Component, OnInit } from '@angular/core';
import { Supplier } from '../_models/supplier';
import { SupplierService } from '../_services/supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suppliers',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  newSupplier: Supplier = {};

  constructor(private supplierService: SupplierService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(
      (suppliers) => {
        this.suppliers = suppliers;
      },
      (error) => {
        console.log('Error retrieving suppliers:', error);
        this.toastr.error('Erro ao carregar Fornecedores!', error);
      }
    );
  }

  editSupplier(id: string): void {
    const updatedSupplier: Supplier = {};

    this.supplierService.editSupplier(id, updatedSupplier).subscribe(
      (response) => {
        console.log('Supplier updated successfully:', response);
        this.loadSuppliers();
      },
      (error) => {
        console.log('Error updating supplier:', error);
        this.toastr.error('Erro ao atualizar Fornecedor!', error);
      }
    );
  }

  toggleEditMode(supplier: Supplier): void {
    supplier.editMode = !supplier.editMode;
  }

  saveSupplier(supplier: Supplier): void {
    const supplierId = supplier.id || '';

    this.supplierService.editSupplier(supplierId, supplier).subscribe(
      () => {
        supplier.editMode = false;
      },
      (error) => {
        console.log('Error saving supplier:', error);
        this.toastr.error('Erro ao guardar Fornecedor!', error);
      }
    );
  }

  createSupplier(): void {
    this.supplierService.createSupplier(this.newSupplier).subscribe(
      (response) => {
        console.log('Supplier created successfully:', response);
        this.toastr.success('Fornecedor criado com sucesso!');
        this.loadSuppliers();
        this.newSupplier = {};
      },
      (error) => {
        console.log('Error creating supplier:', error);
        this.toastr.error('Erro ao criar Fornecedor!', error);
      }
    );
  }


  deleteSupplier(id: string | undefined): void {
    if (id) {
      if (confirm('Are you sure you want to delete this supplier?')) {
        this.supplierService.deleteSupplier(id).subscribe(
          () => {
            console.log('Supplier deleted successfully');
            this.loadSuppliers();
          },
          (error) => {
            console.log('Error deleting supplier:', error);
          }
        );
      }
    }
  }

  cancelEdit(supplier: Supplier): void {
    supplier.editMode = false;
  }

  private getOriginalSupplier(id: string): Supplier | undefined {
    return this.suppliers.find((supplier) => supplier.id === id);
  }

}
