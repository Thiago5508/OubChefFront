import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})

export class ListProduct{
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  getProduct(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/product/list`)
  }
}