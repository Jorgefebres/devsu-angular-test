import { Component } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products!: Product[];
  pageSize = 5;
  pageSizes = [5, 10, 20];
  currentPage = 1;
  searchTerm = '';
  loading = true;
  showDeleteModal = false;
  selectedProductForDelete: Product | null = null;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  get paginatedProducts(): Product[] {
    const filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  fetchProducts(): void {
    this.productsService.getProducts().subscribe((products: Array<Product>) => {
      this.products = products;
      this.loading = false;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onMaxPageChange(page: number): void {
    this.pageSize = page;
  }

  goToAddProduct() {
    this.router.navigate(['products/add-product']);
  }

  onActionChange(event: any, product: Product) {
    const action = (event.target as HTMLSelectElement).value;
    if (action === 'delete') {
      this.selectedProductForDelete = product;
      this.showDeleteModal = true;
    } else if (action === 'edit') {
      this.productsService.setSelectedProduct(product);
      this.router.navigate(['products/add-product']);
    }
  }

  onDeleteProduct(): void {
    if (this.selectedProductForDelete) {
      this.productsService
        .deleteProduct(this.selectedProductForDelete.id)
        .pipe(
          catchError((error) => this.handleDeleteError(error)),
          finalize(() => (this.loading = false))
        )
        .subscribe(() => this.handleDeleteSuccess());
    }
  }

  handleDeleteError(error: any): Observable<never> {
    return throwError(error);
  }

  handleDeleteSuccess() {
    this.fetchProducts();
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedProductForDelete = null;
  }
}
