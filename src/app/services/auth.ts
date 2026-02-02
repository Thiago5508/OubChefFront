import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type LoginPayload = {
  identifier: {
    email?: string;
    phone?: string;
  };
  password: string;
};

@Injectable({
  providedIn: 'root'
})


export class Auth {

  private apiUrl = 'http://localhost:3333'; // seu backend

  constructor(private http: HttpClient) {}

  createUser(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data);
  }

  login(data:LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  changePassword(data: { oldPassword: string; newPassword: string }, token: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/change-password`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
 setToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  } 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
