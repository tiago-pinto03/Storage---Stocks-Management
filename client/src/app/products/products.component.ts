import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showProducts: boolean = false;
  showEditProducts: boolean = false;
  isEditingProduct: boolean = false;
  product?: Product;
  editedProduct: Product = {};
  selectedProduct: Product | null = null;
  newProduct: Product = {};
  showAddProductForm: boolean = false;
  updateSuccess: boolean = false;

  constructor(private productService: ProductService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.log('Error retrieving products:', error);
        this.toastr.error('Erro ao carregar produtos!', error);
      }
    );
  }

  toggleProducts(): void {
    this.showProducts = !this.showProducts;
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
        },
        (error) => {
          console.error(error);
          this.toastr.error('Erro ao atualizar produto!', error);
        }
      );
  }

  updateSupplierId(supplierId: string): void {
    if (!this.editedProduct.supplier) {
      this.editedProduct.supplier = {};
    }
    this.editedProduct.supplier.id = supplierId;
  }


  cancelEdit(): void {
    this.selectedProduct = null;
  }


  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(
      (addedProduct) => {
        this.products.push(addedProduct);
        this.newProduct = {};
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
          },
          (error) => {
            console.error(error);
            this.toastr.error('Erro ao excluir produto!', error);
          }
        );
    }
  }

}
