import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from './listcategory.service';

@Injectable({
  providedIn: 'root'
})
export class CreateCategoryService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCategory(name: string): Observable<Category> {
    const body = { name };
    return this.http.post<Category>(`${this.apiUrl}/category/create`, body);
  }
}
