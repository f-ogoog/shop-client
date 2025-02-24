import { Routes } from '@angular/router';
import { ProductsCatalogComponent } from './components/products-catalog/products-catalog.component';
import { ProductsCartComponent } from './components/products-cart/products-cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

export const routes: Routes = [
  { path: 'products', component: ProductsCatalogComponent },
  { path: 'cart', component: ProductsCartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '**', redirectTo: 'products' },
];
