import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  isMobile = false;
  isMobileMenuOpen = false;

  constructor(private readonly authService: AuthService) {
    this.checkIsMobile();
    window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
      this.isMobile = e.matches;
    });
  }

  checkIsMobile() {
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe();
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }
}
