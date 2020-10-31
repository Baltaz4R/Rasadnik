import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { startWith } from 'rxjs/operators';
import { EnterpriseService } from '../services/enterprise.service';

export type SortColumn = keyof Product | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };
const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class ProductsHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [DecimalPipe]
})
export class ProductsComponent implements OnInit {

  store: Array<any>;
  store$: BehaviorSubject<Array<any>>;

  filter = new FormControl('');

  @ViewChildren(ProductsHeader) headers: QueryList<ProductsHeader>;

  productForm: FormGroup;
  errorMessage: string;
  submitted = false;
  type: string  = "TREE";

  constructor(private router: Router,
              pipe: DecimalPipe,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private enterpriseService: EnterpriseService) {

    this.filter.valueChanges.subscribe(text => {
      startWith('');

      let result = this.store.filter(product => {
        const term = text.toLowerCase();
        return product.name.toLowerCase().includes(term)
            || product.manufacturer.toLowerCase().includes(term)
            || pipe.transform(product.quantity).includes(term)
            || pipe.transform(product.days).includes(term)
            || pipe.transform(product.price).includes(term)
            || pipe.transform(product.reviews).includes(term);
      });

      this.store$.next(result);
    });
  }

  ngOnInit(): void {
    this.enterpriseService.getStore().subscribe(store => {
      this.store = store;
      this.store$ = new BehaviorSubject<Array<Product>>(store);
    });

    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      manufacturer: ['', [Validators.required, Validators.minLength(2)]],
      quantity: ['', Validators.required],
      days: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  delete(product): void {
    this.enterpriseService.delete(product._id).subscribe(
      data => {
        this.enterpriseService.getStore().subscribe(store => {
          this.store = store;
          this.store$ = new BehaviorSubject<Array<Product>>(store);
        });
      },
      error => {
        console.log(error);
    });
  }

  addProduct(): void {
    this.submitted = true;

    // Stop here if form is invalid.
    if (this.productForm.invalid) {
      return;
    }

    this.productForm.value.type = this.type;

    this.enterpriseService.addProduct(this.productForm.value).subscribe(
      data => {
        this.enterpriseService.getStore().subscribe(store => {
          this.store = store;
          this.store$ = new BehaviorSubject<Array<Product>>(store);
        });
      },
      error => {
        this.errorMessage = error.error;
    });
  }

  onSort({ column, direction }: SortEvent) {

    // Resetting other headers.
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // Sorting store.
    if (direction === '' || column === '') {
      this.enterpriseService.getStore().subscribe(store => this.store$.next(store));
    } else {
      let store = [...this.store$.value].sort((a, b) => {
        const res = compare(`${a[column]}`, `${b[column]}`);
        return direction === 'asc' ? res : -res;
      });
      this.store$.next(store);
    }
  }

}