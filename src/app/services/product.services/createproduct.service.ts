import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Product {
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createProduct(name: string,description: string,basePrice: number,category: string): Observable<Product> {
    const body = { name, description, basePrice,category };
    return this.http.post<Product>(`${this.apiUrl}/product/create`, body);
  }
}
