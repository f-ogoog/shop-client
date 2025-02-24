import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreatedOrder,
  Order,
  OrdersWithPagination,
  SimpleOrder,
  SimpleOrderWithPrice,
} from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  ordersUrl = `${environment.apiUrl}/orders/`;

  constructor(private http: HttpClient) {}

  createOrder(order: CreatedOrder): Observable<SimpleOrderWithPrice> {
    return this.http.post<SimpleOrderWithPrice>(this.ordersUrl, order);
  }

  getOrders(
    search: string,
    order: string,
    status: string,
    page: number = 1,
    limit: number = 5
  ): Observable<OrdersWithPagination> {
    let params = new HttpParams();
    params = params.set('order', order);
    params = params.set('page', page);
    params = params.set('limit', limit);
    if (status && status !== 'Всі') {
      params = params.set('status', status);
    }
    if (search && !isNaN(Number(search))) {
      params = params.set('search', search);
    }

    return this.http.get<OrdersWithPagination>(this.ordersUrl, {
      params,
      withCredentials: true,
    });
  }

  getOrder(id: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.ordersUrl}${id}`, {
      withCredentials: true,
    });
  }

  updateOrderStatus(
    id: string,
    status: string
  ): Observable<{ order: SimpleOrder }> {
    let params = new HttpParams();
    params = params.set('status', status);
    return this.http.patch<{ order: SimpleOrder }>(
      `${this.ordersUrl}${id}`,
      {},
      {
        params,
        withCredentials: true,
      }
    );
  }
}
