import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';

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

  constructor(private productService: ProductService) {}

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
    this.productService.updateProduct(this.product)
      .subscribe(
        () => {
          this.updateSuccess = true;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  /* updateProduct(product: Product): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.selectedProduct.name = this.editedProduct.name;
      this.selectedProduct.unitPrice = this.editedProduct.unitPrice;
      this.selectedProduct.quantity = this.editedProduct.quantity;
      this.selectedProduct.available = this.editedProduct.available;

      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
        (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.selectedProduct = null;
        },
        (error) => {
          console.log('Error updating product:', error);
        }
      );
    }
  } */

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
      }
    );
  }




}
