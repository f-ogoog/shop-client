import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../models/products.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() fetchProducts = new EventEmitter<void>();

  selectedProduct: Product | null = null;
  count: number = 1;
  isAdmin: boolean = false;
  errorMessage: string = '';

  measurementUnits: { [key: string]: string } = {
    kg: 'кг',
    l: 'л',
    unit: 'шт',
  };

  get measurementUnitsKeys(): string[] {
    return Object.keys(this.measurementUnits);
  }

  constructor(
    private readonly productService: ProductsService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  openModal(product: Product): void {
    this.selectedProduct = product;
    this.count = 1;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  addToCart(): void {
    if (!this.selectedProduct) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingProduct = cart.find(
      (product: Product) => product.id === this.selectedProduct?.id
    );

    if (existingProduct) {
      existingProduct.count += this.count;
    } else {
      cart.push({
        ...this.selectedProduct,
        count: this.count,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    this.closeModal();
  }

  validateCount(): void {
    if (this.count < 1 || isNaN(this.count)) {
      this.count = 1;
    }
  }

  deleteProduct(productId: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Ви впевнені, що хочете видалити цей продукт?')) return;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.fetchProducts.emit();
    });
  }

  updateProduct(): void {
    this.productService
      .updateProduct(this.selectedProduct?.id!, this.selectedProduct!)
      .subscribe({
        next: () => {
          this.fetchProducts.emit();
          this.closeModal();
        },
        error: () => {
          this.errorMessage = 'Не вдалося оновити продукт. Перевірте дані.';
        },
      });
  }
}
