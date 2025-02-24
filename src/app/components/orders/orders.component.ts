import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  totalPages: number = 1;
  page: number = 1;
  searchQuery: string = '';
  order: 'asc' | 'desc' = 'desc';
  statusFilter: string = '';
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  statuses: { [key: string]: string } = {
    created: 'Створено',
    paid: 'Оплачено',
    shipped: 'Відправлено',
    received: 'Отримано',
    declined: 'Відхилено',
  };

  statusesFilterEnum: { [key: string]: string } = {
    Всі: '',
    Створено: 'created',
    Оплачено: 'paid',
    Відправлено: 'shipped',
    Отримано: 'received',
    Відхилено: 'declined',
  };

  statusesEnum: { [key: string]: string } = {
    Створено: 'created',
    Оплачено: 'paid',
    Відправлено: 'shipped',
    Отримано: 'received',
    Відхилено: 'declined',
  };

  measurementUnits: { [key: string]: string } = {
    kg: 'кг',
    l: 'л',
    unit: 'шт',
  };

  get statusFilterKeys(): string[] {
    return Object.keys(this.statusesFilterEnum);
  }

  get statusKeys(): string[] {
    return Object.keys(this.statusesEnum);
  }

  selectedOrder: Order | null = null;

  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
      if (this.isAuthenticated) {
        this.fetchOrders();
      }
    });
  }

  fetchOrders(): void {
    this.ordersService
      .getOrders(this.searchQuery, this.order, this.statusFilter, this.page)
      .subscribe(({ orders, pagination }) => {
        this.orders = orders;
        this.totalPages = pagination.totalPages;
      });
  }

  search(): void {
    this.page = 1;
    this.fetchOrders();
  }

  toggleSortOrder(): void {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.fetchOrders();
  }

  filterByStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter =
      this.statusesEnum[selectElement.value as keyof typeof this.statuses];
    this.page = 1;
    this.fetchOrders();
  }

  goToPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.fetchOrders();
    }
  }

  openModal(orderId: string): void {
    this.ordersService.getOrder(orderId).subscribe(({ order }) => {
      this.selectedOrder = order;
    });
  }

  closeModal(): void {
    this.selectedOrder = null;
  }

  get discountedPrice(): number {
    if (!this.selectedOrder) return 0;
    return Number(
      (
        this.selectedOrder.totalPrice *
        (1 - this.selectedOrder.discount / 100)
      ).toFixed(2)
    );
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.ordersService
      .updateOrderStatus(orderId, status)
      .subscribe(({ order }) => {
        this.selectedOrder!.status = order.status;
        this.fetchOrders();
      });
  }
}
