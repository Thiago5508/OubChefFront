import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Ingredient {
  name: string;
  description: string;
  extraPrice: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateIngredientService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createIngredient(name: string,description: string,extraPrice: number,category: string): Observable<Ingredient> {
    const body = { name, description, extraPrice,category };
    return this.http.post<Ingredient>(`${this.apiUrl}/ingredient/create`, body);
  }
}
