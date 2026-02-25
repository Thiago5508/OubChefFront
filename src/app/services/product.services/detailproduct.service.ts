import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductProps {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class detailCategory{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getDetailProduct(ProductId:string): Observable<ProductProps[]> {
    return this.http.get<ProductProps[]>(`${this.apiUrl}/product/detail/${ProductId}`)
  }
}