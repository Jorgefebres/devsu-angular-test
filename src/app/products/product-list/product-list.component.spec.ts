import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
    });
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products based on the searchTerm', () => {
    component.searchTerm = 'producto 1';
    const filteredProducts = component.paginatedProducts;
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].name).toContain('producto 1');
  });

  it('should calculate total pages correctly', () => {
    component.pageSize = 3;
    expect(component.totalPages).toBe(2);
  });

  it('should change currentPage on onPageChange', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
  });

  it('should generate an array of page numbers', () => {
    component.pageSize = 3;
    const pagesArray = component.getPagesArray();
    expect(pagesArray).toEqual([1, 2]);
  });
});
