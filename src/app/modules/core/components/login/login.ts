import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
private authService = inject(AuthService);
  constructor( ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
onLogin() {
  const { username, password } = this.loginForm.value;

  if (username === 'bhagwat' && password === 'krishnamercy') {
    this.authService.login(); // Set the key in localStorage
    this.router.navigate(['/userlist']);
  } else {
    this.errorMessage = 'Invalid Username or Password';
  }
}
}