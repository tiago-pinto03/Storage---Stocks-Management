import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../_models/employee';
import { EmployeeService } from '../_services/employee.service';
import { Supplier } from '../_models/supplier';
import { SupplierService } from '../_services/supplier.service';
import { CategoryService } from '../_services/category.service';
import { Category } from '../_models/category';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showProducts: boolean = false;
  showProducts2: boolean = false;
  showEditProducts: boolean = false;
  isEditingProduct: boolean = false;
  product?: Product;
  editedProduct: Product = {};
  selectedProduct: Product | null = null;
  newProduct: Product = {};
  showAddProductForm: boolean = false;
  updateSuccess: boolean = false;
  searchProductName: string = '';
  supplier: Supplier[] = [];
  category: Category[] = [];

  constructor(private productService: ProductService, private toastr: ToastrService, private supplierService: SupplierService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers();
    this.loadCategories();
  }

  loadProducts(): void {
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

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(
      (suppliers) => {
        this.supplier = suppliers;
      },
      (error) => {
        console.log('Error retrieving suppliers:', error);
        this.toastr.error('Erro ao carregar Fornecedores!', error);
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (cat) => {
        this.category = cat;
      },
      (error) => {
        console.log('Error retrieving categories:', error);
        this.toastr.error('Erro ao carregar Categorias!', error);
      }
    );
  }

  get filteredProducts(): Product[] {
    if (this.searchProductName) {
      return this.products.filter((product) =>
        product?.name?.toLowerCase().includes(this.searchProductName.toLowerCase())
      );
    }
    return this.products;
  }

  toggleProducts(): void {
    this.showProducts = !this.showProducts;
  }

  toggleProducts2(): void {
    this.showProducts2 = !this.showProducts2;
  }

  toggleEditProducts(): void {
    this.showEditProducts = !this.showEditProducts;
  }

  toggleAddProductForm(): void {
    this.showAddProductForm = !this.showAddProductForm;
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.editedProduct = { ...product };
  }

  updateProduct() {
    this.productService.updateProduct(this.editedProduct)
      .subscribe(
        () => {
          this.updateSuccess = true;
          location.reload();

          window.onload = () => {
            this.toastr.success('Produto atualizado com sucesso!');
          };
        },
        (error) => {
          console.error(error);
          this.toastr.error('Erro ao atualizar produto!');
        }
      );
  }


  updateSupplierId(supplierId: string) {
    const selectedEmployee = this.supplier.find((supplier) => supplier.id === supplierId);
    this.editedProduct.supplier = selectedEmployee;
  }


  cancelEdit(): void {
    this.selectedProduct = null;
  }


  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(
      (addedProduct) => {
        this.products.push(addedProduct);
        this.newProduct = {};
        this.toastr.success('Produto criado com sucesso!');
      },
      (error) => {
        console.log('Error adding product:', error);
        this.toastr.error('Erro ao adicionar produto!', error);
      }
    );
  }

  deleteProduct(productId: string | undefined) {
    if (!productId) {
      return;
    }
    if (confirm('Deseja excluir o produto?')) {
      this.productService.deleteProduct(productId)
        .subscribe(
          () => {
            this.showEditProducts = false;
            this.toastr.success('Produto excluido com sucesso!');
          },
          (error) => {
            console.error(error);
            this.toastr.error('Erro ao excluir produto!', error);
          }
        );
    }
  }

}
