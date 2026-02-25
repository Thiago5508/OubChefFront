import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Category, ListCategory } from '../../services/category.services/listcategory.service';
import { CommonModule } from '@angular/common';
import { CreateCategoryService } from '../../services/category.services/createcategory.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CategoryProps, detailCategory } from '../../services/category.services/detailcategory.service';


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
  expandedCategoryId = signal<string | null>(null);
  detailcategory = signal<Record<string,CategoryProps[]>>({});
  

  form!:FormGroup<CategoryForm>;

  constructor(
    private listCategory: ListCategory,
    private auth: Auth,
    private router: Router, 
    private createCategoryService: CreateCategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private detailservice: detailCategory,
  ) {}

  ngOnInit() {
    this.form = this.fb.group<CategoryForm>({
      category:this.fb.nonNullable.control('',{validators:[Validators.required, Validators.minLength(2)]})
    });

    this.fetchCategory()
  }

  fetchCategory() {
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
  
  loadCategory(categoryId: string) {
  if (this.detailcategory()[categoryId]) return;

  this.detailservice.getDetailCategory(categoryId).subscribe({
    next: (items) => {
      this.detailcategory.update((current) => ({
        ...current,
        [categoryId]: items
      }));
    },
    error: (err) => {
      console.error('Erro ao buscar itens', err);
    }
  });
}


  toggleOrder(categoryId: string) {
    this.expandedCategoryId.update((current) =>
      current === categoryId ? null : categoryId
    );
     if (this.expandedCategoryId() === categoryId) {
    this.loadCategory(categoryId);
    }
  }

  createCategory(){
    if(this.form.invalid)return;
    const name=this.form.controls.category.value

    this.createCategoryService.createCategory(name).subscribe({
      next:(category)=>{
        this.form.reset()
        this.fetchCategory();
        console.log(category)
         this.snackBar.open(`Categoria "${category.name}" criada com sucesso`,'Fechar',
          {duration: 3000,horizontalPosition: 'right',verticalPosition: 'top'});
      }, error:(err)=>{
        console.error(err)
      }
    })
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  refresh() {
    this.expandedCategoryId.set(null);
  this.fetchCategory()
  }
}