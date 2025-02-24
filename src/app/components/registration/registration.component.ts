import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  user = {
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    address: '',
    password: '',
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.registration(this.user).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = 'Помилка реєстрації. Перевірте введені дані.';
      },
    });
  }
}
