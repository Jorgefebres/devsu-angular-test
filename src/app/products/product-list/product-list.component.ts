import { Component } from '@angular/core';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products: Product[] = [
    {
      id: 1,
      logo: 'logo.jpg',
      name: 'nombre del producto 1',
      description: 'Descripción',
      releaseDate: '01/01/2000',
      revisionDate: '01/01/2001',
    },
    {
      id: 2,
      logo: 'logo.jpg',
      name: 'nombre del producto 2',
      description: 'Descripción',
      releaseDate: '01/01/2000',
      revisionDate: '01/01/2001',
    },
    {
      id: 3,
      logo: 'logo.jpg',
      name: 'nombre del producto 3',
      description: 'Descripción',
      releaseDate: '01/01/2000',
      revisionDate: '01/01/2001',
    },
    {
      id: 4,
      logo: 'logo.jpg',
      name: 'nombre del producto 4',
      description: 'Descripción',
      releaseDate: '01/01/2000',
      revisionDate: '01/01/2001',
    },
    {
      id: 5,
      logo: 'logo.jpg',
      name: 'nombre del producto 5',
      description: 'Descripción',
      releaseDate: '01/01/2000',
      revisionDate: '01/01/2001',
    },
    {
      id: 6,
      logo: 'logo.jpg',
      name: 'nombre del producto 6',
      description: 'Descripción',
      releaseDate: '01/01/2000',
      revisionDate: '01/01/2001',
    },
  ];

  pageSize = 5;
  currentPage = 1;
  searchTerm = '';

  get paginatedProducts(): Product[] {
    const filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
