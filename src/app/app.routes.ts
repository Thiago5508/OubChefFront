import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category';
import { ProductsComponent } from './pages/products/products';
import { AdicionaisComponent } from './pages/adicionais/adicionais';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // inicia no login
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category', component: CategoryComponent },
  {path:  'products', component: ProductsComponent},
  {path:  'adicionais', component: AdicionaisComponent},
  { path: '**', redirectTo: 'login' } // fallback
];