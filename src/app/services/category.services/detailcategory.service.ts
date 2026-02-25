import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoryProps {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class detailCategory{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getDetailCategory(CategoryId:string): Observable<CategoryProps[]> {
    return this.http.get<CategoryProps[]>(`${this.apiUrl}/category/detail/${CategoryId}`)
  }
}