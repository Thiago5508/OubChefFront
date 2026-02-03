import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ListProduct, Product } from '../../services/product.services/listproduct.service';
import { CreateProductService } from '../../services/product.services/createproduct.service';
import { Category, ListCategory } from '../../services/category.services/listcategory.service';


type ProductForm = {
  name: FormControl<string>;
  category: FormControl<string>;
  basePrice: FormControl<number>;
  description: FormControl<string>;
};


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})

export class ProductsComponent implements OnInit{
 loading: WritableSignal<boolean> = signal(true);
 products: WritableSignal<Product[]> = signal([]);
 expandedOrderId = signal<string | null>(null);
 categories: WritableSignal<Category[]> = signal([]);

  form!:FormGroup<ProductForm>;

  constructor(
    private listProduct: ListProduct,
    private listCategory: ListCategory,
    private createProductService: CreateProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group<ProductForm>({
      name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      category: this.fb.nonNullable.control('', Validators.required),
      basePrice: this.fb.nonNullable.control(0.0, [Validators.required, Validators.min(0)]),
      description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    });

    this.loadProduct()
    this.loadCategory()
    
  }

  loadProduct() {
    this.loading.set(true);
    this.listProduct.getProduct().subscribe({
      next: (products) => {
        this.products.set(products);
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

  createCProduct(){
    if(this.form.invalid)return;
     const raw = this.form.getRawValue();
    const {name, description, basePrice,category}=this.form.getRawValue()

    this.createProductService.createProduct(name, description, basePrice,category).
    subscribe({
      next:(product)=>{
        this.form.reset({
          name:'', 
          description:'', 
          basePrice:0.0,
          category:''
        })
        this.loadProduct();
        console.log(product)
         this.snackBar.open(`Produto "${product.name}" criada com sucesso`,'Fechar',
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
  this.loadProduct()
  }

}