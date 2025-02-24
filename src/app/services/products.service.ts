import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product, ProductsWithPagination } from '../models/products.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productsUrl = `${environment.apiUrl}/products/`;

  constructor(private http: HttpClient) {}

  getProducts(
    search: string,
    order: 'asc' | 'desc',
    page: number,
    limit: number
  ): Observable<ProductsWithPagination> {
    let params = new HttpParams();
    params = params.set('search', search);
    params = params.set('order', order);
    params = params.set('page', page);
    params = params.set('limit', limit);

    return this.http.get<ProductsWithPagination>(this.productsUrl, { params });
  }

  createProduct(data: Partial<Product>): Observable<{ product: Product }> {
    return this.http.post<{ product: Product }>(this.productsUrl, data, {
      withCredentials: true,
    });
  }

  deleteProduct(productId: string): Observable<{ product: Product }> {
    return this.http.delete<{ product: Product }>(
      `${this.productsUrl}${productId}`,
      { withCredentials: true }
    );
  }

  updateProduct(
    productId: string,
    data: Partial<Product>
  ): Observable<{ product: Product }> {
    return this.http.patch<{ product: Product }>(
      `${this.productsUrl}${productId}`,
      data,
      { withCredentials: true }
    );
  }
}
