import { Pagination } from './pagination.model';

export interface Product {
  id: string;
  name: string;
  price: number;
  measurementUnit: 'kg' | 'l' | 'unit';
}

export interface ProductsWithPagination {
  products: Product[];
  pagination: Pagination;
}

export interface CartProduct extends Product {
  count: number;
}
