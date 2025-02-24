import { Client } from './client.model';
import { Pagination } from './pagination.model';
import { Product } from './products.model';

export interface CreatedOrder {
  client: Client;
  products: {
    productId: string;
    count: number;
  }[];
}

export interface SimpleOrder {
  id: string;
  number: number;
  saleDate: Date;
  deliveryDate: Date;
  status: string;
}

export interface Price {
  totalPrice: number;
  discount: number;
}

export interface SimpleOrderWithPrice {
  order: Order;
  price: Price;
}

export interface Order extends SimpleOrder {
  totalPrice: number;
  discount: number;
  client: Client;
  products: {
    product: Product;
    count: number;
  }[];
}

export interface OrdersWithPagination {
  orders: Order[];
  pagination: Pagination;
}
