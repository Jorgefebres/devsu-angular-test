import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full',
      },
      {
        path: 'product-list',
        component: ProductListComponent,
      },
      {
        path: 'add-product',
        component: AddProductComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
