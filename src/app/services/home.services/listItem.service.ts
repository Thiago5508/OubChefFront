import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Item {
  _id: string;
  quantity: number;
  price: number;
  products: {
    _id: string;
    name: string;
    price: number;
  }[];
  size: {
    _id: string;
    name: string;
    price: number;
  };
  ingredients?: {
    _id: string;
    name: string;
    extraPrice: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ListItem{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getItem(order:string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/item/${order}`)
  }
}