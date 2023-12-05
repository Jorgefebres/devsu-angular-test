import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProductComponent } from './add-product.component';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddProductComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.productForm.value).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
  });

  it('should set the form as invalid when empty', () => {
    expect(component.productForm.valid).toBeFalsy();
  });

  it('should set the form as valid when fields are filled', () => {
    const form = component.productForm;
    form.controls['id'].setValue('Test id');
    form.controls['name'].setValue('Test Product');
    form.controls['description'].setValue('Test description');
    form.controls['logo'].setValue('Test logo');
    form.controls['date_release'].setValue('Test date_release');
    form.controls['date_revision'].setValue('Test date_revision');
    expect(form.valid).toBeTruthy();
  });

  it('should call resetForm on addProduct when form is valid', () => {
    const resetFormSpy = jest.spyOn(component, 'resetForm');
    component.productForm.setValue({
      id: 'Test id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test logo',
      date_release: 'Test date_release',
      date_revision: 'Test date_revision',
    });
    component.addProduct();
    expect(resetFormSpy).toHaveBeenCalled();
  });

  it('should not call resetForm on addProduct when form is invalid', () => {
    const resetFormSpy = jest.spyOn(component, 'resetForm');
    component.addProduct();
    expect(resetFormSpy).not.toHaveBeenCalled();
  });

  it('should reset the form on calling resetForm', () => {
    const form = component.productForm;
    form.controls['id'].setValue('Test id');
    form.controls['name'].setValue('Test Product');
    form.controls['description'].setValue('Test description');
    form.controls['logo'].setValue('Test logo');
    form.controls['date_release'].setValue('Test date_release');
    form.controls['date_revision'].setValue('Test date_revision');
    component.resetForm();
    expect(form.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null,
    });
  });
});
