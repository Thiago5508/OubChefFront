import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Category {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class ListCategory{
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getCategory(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiUrl}/category/list`)
  }
}