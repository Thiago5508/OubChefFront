import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Category, ListCategory } from '../../services/category.services/listcategory.service';
import { CreateIngredientService } from '../../services/ingredients/createIngredient.service';
import { ListIngredient,Ingredient } from '../../services/ingredients/listingredient.service';


type IngredientsForm = {
  name: FormControl<string>;
  category: FormControl<string>;
  extraPrice: FormControl<number>;
  description: FormControl<string>;
};


@Component({
  selector: 'app-adicionais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './adicionais.html',
  styleUrl: './adicionais.scss',
})

export class AdicionaisComponent implements OnInit{
 loading: WritableSignal<boolean> = signal(true);
 ingredients: WritableSignal<Ingredient[]> = signal([]);
 expandedOrderId = signal<string | null>(null);
 categories: WritableSignal<Category[]> = signal([]);

  form!:FormGroup<IngredientsForm>;

  constructor(
    private listIngredient: ListIngredient,
    private listCategory: ListCategory,
    private createIngredientService: CreateIngredientService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group<IngredientsForm>({
      name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      category: this.fb.nonNullable.control('', Validators.required),
      extraPrice: this.fb.nonNullable.control(0.0, [Validators.required, Validators.min(0)]),
      description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    });

    this.loadIngredient()
    this.loadCategory()
    
  }

  loadIngredient() {
    this.loading.set(true);
    this.listIngredient.getIngredient().subscribe({
      next: (ingredients) => {
        this.ingredients.set(ingredients);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar itens', err);
        this.loading.set(false);
      }
    });
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

  createCIngredient(){
    if(this.form.invalid)return;
    const {name, description, extraPrice,category}=this.form.getRawValue()

    this.createIngredientService.createIngredient(name, description, extraPrice,category).
    subscribe({
      next:(ingredient)=>{
        this.form.reset({
          name:'', 
          description:'', 
          extraPrice:0.0,
          category:''
        })
        this.loadIngredient();
        console.log(ingredient)
         this.snackBar.open(`Produto "${ingredient.name}" criada com sucesso`,'Fechar',
          {duration: 3000,horizontalPosition: 'right',verticalPosition: 'top'});
      }, 
      error:(err)=>{
        console.error(err)
        this.snackBar.open('Erro ao criar produto', 'Fechar', { duration: 3000 });
      }
    })
  }

  refresh() {
  this.expandedOrderId.set(null);
  this.loadIngredient()
  }

}