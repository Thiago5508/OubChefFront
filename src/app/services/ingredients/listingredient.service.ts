import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Ingredient {
  _id: string;
  name: string;
  description: string;
  extraPrice: string;
  category: string;
  active:Boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ListIngredient{
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  getIngredient(): Observable<Ingredient[]>{
    return this.http.get<Ingredient[]>(`${this.apiUrl}/ingredient/list`)
  }
}