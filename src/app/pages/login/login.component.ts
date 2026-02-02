
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
  
})
export class LoginComponent {
  loginField = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: Auth,private router: Router) {}
  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
    login() {
    this.error = '';
    this.loading = true;

    const identifier: { email?: string; phone?: string } = {};
    if (this.isEmail(this.loginField)) {
    identifier.email = this.loginField.trim().toLowerCase();
  } else {
    identifier.phone = this.loginField.replace(/\D/g, '');
  }

      this.auth.login({ identifier, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        const token = res?.token;
        if (token) {
          this.auth.setToken(token);
          localStorage.setItem('user', JSON.stringify(res.user ?? {}));
          this.router.navigate(['/home']);
        } else {
          this.error = 'Resposta inválida do servidor';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || err?.error?.message || 'Erro ao fazer login';
      }
    });
  }
}