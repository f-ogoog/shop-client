import { Component } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-catalog',
  imports: [CommonModule, ProductsListComponent, FormsModule],
  templateUrl: './products-catalog.component.html',
  styleUrl: './products-catalog.component.scss',
})
export class ProductsCatalogComponent {
  products: Product[] = [];
  searchQuery: string = '';
  order: 'asc' | 'desc' = 'asc';
  page: number = 1;
  limit: number = 15;
  totalPages: number = 1;
  isAdmin: boolean = false;
  showCreateModal: boolean = false;
  newProduct: Partial<Product> = {
    name: '',
    price: 0,
    measurementUnit: 'unit',
  };
  errorMessage: string = '';

  constructor(
    private readonly productService: ProductsService,
    private readonly authService: AuthService
  ) {}

  measurementUnits: { [key: string]: string } = {
    kg: 'кг',
    l: 'л',
    unit: 'шт',
  };

  get measurementUnitsKeys(): string[] {
    return Object.keys(this.measurementUnits);
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService
      .getProducts(this.searchQuery, this.order, this.page, this.limit)
      .subscribe(({ products, pagination }) => {
        this.products = products;
        this.totalPages = pagination.totalPages;
      });
  }

  search(): void {
    this.page = 1;
    this.fetchProducts();
  }

  toggleSortOrder(): void {
    this.order =
      this.order === 'asc' ? (this.order = 'desc') : (this.order = 'asc');
    this.fetchProducts();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.fetchProducts();
    }
  }

  openCreateModal(): void {
    this.newProduct = { name: '', price: 0, measurementUnit: 'unit' };
    this.errorMessage = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.closeCreateModal();
        this.fetchProducts();
      },
      error: (err) => {
        this.errorMessage =
          'Не вдалося створити продукт. Перевірте дані і спробуйте ще раз.';
      },
    });
  }
}
