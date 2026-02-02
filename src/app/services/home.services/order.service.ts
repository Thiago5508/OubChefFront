import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
  _id: string;
  customerName: string;
  table: Table;
  total: number;
  active: boolean;
  createdAt: string;
  waiter:Waiter;
}
export interface Table{
  _id:string;
  number:string;
  letter:string;
}
export interface Waiter{
  _id:string;
  name:string;
}



@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(filters?: { active?: boolean; startDate?: string; endDate?: string }): Observable<Order[]> {
    let params = new HttpParams()
      .set('active', (filters?.active ?? true).toString());

    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);

    return this.http.get<Order[]>(`${this.apiUrl}/order/all`, { params });
  }
}
