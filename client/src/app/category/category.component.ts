import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../_services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../_models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  category: Category[] = [];
  newCategory: Category = {};

  constructor(private categoryService: CategoryService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadCategorys();
  }

  loadCategorys(): void {
    this.categoryService.getCategories().subscribe(
      (category) => {
        this.category = category;
      },
      (error) => {
        console.log('Error retrieving category:', error);
        this.toastr.error('Erro ao carregar Categorias!', error);
      }
    );
  }

  editCategory(id: string): void {
    const updatedCategory: Category = {};

    this.categoryService.editCategory(id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.loadCategorys();
      },
      (error) => {
        console.log('Error updating category:', error);
        this.toastr.error('Erro ao atualizar Categoria!', error);
      }
    );
  }

  toggleEditMode(category: Category): void {
    category.editMode = !category.editMode;
  }

  saveCategory(category: Category): void {
    const categoryId = category.id || '';

    this.categoryService.editCategory(categoryId, category).subscribe(
      () => {
        category.editMode = false;
      },
      (error) => {
        console.log('Error saving category:', error);
        this.toastr.error('Erro ao guardar Fornecedor!', error);
      }
    );
  }

  createCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe(
      (response) => {
        console.log('Category created successfully:', response);
        this.toastr.success('Categoria criado com sucesso!');
        this.loadCategorys();
        this.newCategory = {};
      },
      (error) => {
        console.log('Error creating category:', error);
        this.toastr.error('Erro ao criar Categoria!', error);
      }
    );
  }


  deleteCategory(id: string | undefined): void {
    if (id) {
      if (confirm('Are you sure you want to delete this category?')) {
        this.categoryService.deleteCategory(id).subscribe(
          () => {
            console.log('Category deleted successfully');
            this.toastr.success('Categoria apagada com sucesso!');
            this.loadCategorys();
          },
          (error) => {
            console.log('Error deleting category:', error);
            this.toastr.error('Erro ao apagar Categoria!');
          }
        );
      }
    }
  }

  cancelEdit(category: Category): void {
    category.editMode = false;
  }

  private getOriginalCategory(id: string): Category | undefined {
    return this.category.find((category) => category.id === id);
  }
}
