import { Component } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products!: Product[];
  pageSize = 5;
  currentPage = 1;
  searchTerm = '';
  loading = true;

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

  goToAddProduct() {
    this.router.navigate(['products/add-product']);
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
