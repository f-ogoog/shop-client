import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartProduct, Product } from '../../models/products.model';
import { Client } from '../../models/client.model';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders.service';
import { CreatedOrder, SimpleOrderWithPrice } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-cart.component.html',
  styleUrl: './products-cart.component.scss',
})
export class ProductsCartComponent {
  cart: CartProduct[] = [];
  totalPrice: number = 0;
  discount: number = 0;
  finalPrice: number = 0;
  orderNumber: number = 0;
  orderId: string = '';
  errorMessage: string = '';

  isOrderModalOpen: boolean = false;
  isModalOpen: boolean = false;
  isAuthenticated: boolean = false;
  client: Client = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
  };

  measurementUnits: { [key: string]: string } = {
    kg: 'кг',
    l: 'л',
    unit: 'шт',
  };

  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.calculateTotalPrice();
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter((product) => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cart.reduce(
      (sum, product) => sum + product.price * product.count,
      0
    );
  }

  openModal(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.client = {
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          email: user.email,
          phone: user.phone,
          address: user.address,
        };
      }
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.errorMessage = '';
  }

  openOrderModal({ order, price }: SimpleOrderWithPrice): void {
    this.orderId = order.id;
    this.orderNumber = order.number;
    this.totalPrice = price.totalPrice;
    this.discount = price.discount;
    this.finalPrice = this.totalPrice - (this.totalPrice * this.discount) / 100;
    this.isOrderModalOpen = true;
  }

  closeOrderModal(): void {
    this.orderId = '';
    this.orderNumber = 0;
    this.totalPrice = 0;
    this.discount = 0;
    this.finalPrice = 0;
    this.isOrderModalOpen = false;
  }

  submitOrder(): void {
    if (!this.cart.length) {
      return;
    }

    const order: CreatedOrder = {
      client: this.client,
      products: this.cart.map((product) => ({
        productId: product.id,
        count: product.count,
      })),
    };

    this.ordersService.createOrder(order).subscribe({
      next: (order) => {
        this.closeModal();
        this.errorMessage = '';
        localStorage.removeItem('cart');
        this.cart = [];

        this.openOrderModal(order);
      },
      error: (err) => {
        this.errorMessage =
          'Помилка при оформленні замовлення. <br> Перевірте дані та спробуйте ще раз.';
      },
    });
  }

  payOrder(): void {
    this.ordersService.updateOrderStatus(this.orderId, 'paid').subscribe(() => {
      this.closeOrderModal();
    });
  }
}
