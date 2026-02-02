import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Category, ListCategory } from '../../services/category.services/listcategory.service';
import { CommonModule } from '@angular/common';
import { CreateCategoryService } from '../../services/category.services/createcategory.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

type CategoryForm = {
  category: FormControl<string>;
};

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})

export class CategoryComponent implements OnInit{
  loading: WritableSignal<boolean> = signal(true);
  categories: WritableSignal<Category[]> = signal([]);
  expandedOrderId = signal<string | null>(null);

  

  form!:FormGroup<CategoryForm>;

  constructor(
    private listCategory: ListCategory,
    private createCategoryService: CreateCategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group<CategoryForm>({
      category:this.fb.nonNullable.control('',{validators:[Validators.required, Validators.minLength(2)]})
    });

    this.loadCategory()
  }

  loadCategory() {
    this.loading.set(true);
    this.listCategory.getCategory().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar itens', err);
        this.loading.set(false);
      }
    });
  }

  createCategory(){
    if(this.form.invalid)return;
    const name=this.form.controls.category.value

    this.createCategoryService.createCategory(name).subscribe({
      next:(category)=>{
        this.form.reset()
        this.loadCategory();
        console.log(category)
         this.snackBar.open(`Categoria "${category.name}" criada com sucesso`,'Fechar',
          {duration: 3000,horizontalPosition: 'right',verticalPosition: 'top'});
      }, error:(err)=>{
        console.error(err)
      }
    })
  }

  refresh() {
  this.expandedOrderId.set(null);
  this.loadCategory()
  }
}