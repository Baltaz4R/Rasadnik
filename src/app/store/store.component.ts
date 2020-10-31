import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgriculturistService } from '../services/agriculturist.service';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { startWith } from 'rxjs/operators';
import { Garden } from '../models/garden';
import { ToastService } from '../services/toast.service';

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
export class StoreHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  providers: [DecimalPipe]
})
export class StoreComponent implements OnInit {

  gardens: Array<Garden>;
  selectedGarden: Garden;

  orders: Array<number>;
  price = 0;

  store: Array<Product>;
  store$: BehaviorSubject<Array<Product>>;

  filter = new FormControl('');

  @ViewChildren(StoreHeader) headers: QueryList<StoreHeader>;

  constructor(private router: Router,
              pipe: DecimalPipe,
              public toastService: ToastService,
              private agriculturistService: AgriculturistService) {

    this.filter.valueChanges.subscribe(text => {
      startWith('');

      let result = this.store.filter(product => {
        const term = text.toLowerCase();
        return product.name.toLowerCase().includes(term)
            || product.manufacturer.toLowerCase().includes(term)
            || pipe.transform(product.quantity).includes(term);
      });

      this.store$.next(result);
    });
  }

  ngOnInit(): void {
    this.agriculturistService.getStore().subscribe(store => {
      this.store = store;
      this.orders = new Array(this.store.length).fill(0);
      this.store$ = new BehaviorSubject<Array<Product>>(store);
    });
    this.agriculturistService.getGardens().subscribe(gardens => {
      this.gardens = gardens;
      this.toastService.update(gardens);
    });
  }

  sum(event): void {
    this.orders.forEach((order, index) => {
      if (order) {
        this.price += this.store[index].price * order;
      }
    });
  }

  order(): void {
    this.agriculturistService.order(this.store, this.orders, this.selectedGarden).subscribe(
      data => {
        alert("Uspešno ste poslali narudžbinu. Molimo vas sečekajte da se vaš zahtev ovbradi.");
        this.router.navigate(['/agriculturist']);
      },
      error => {
        console.log(error);
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
      this.agriculturistService.getStore().subscribe(store => this.store$.next(store));
    } else {
      let store = [...this.store$.value].sort((a, b) => {
        const res = compare(`${a[column]}`, `${b[column]}`);
        return direction === 'asc' ? res : -res;
      });
      this.store$.next(store);
    }
  }

}