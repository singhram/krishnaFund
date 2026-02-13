import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using a Signal to track login status (Modern Angular 20 style)
  isLoggedIn = signal<boolean>(this.hasToken());

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_key');
  }

  login() {
    localStorage.setItem('auth_key', 'succesfully_login');
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('auth_key');
    this.isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}