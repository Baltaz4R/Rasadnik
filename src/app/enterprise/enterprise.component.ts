import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Product } from '../models/product';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { EnterpriseService } from '../services/enterprise.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { StoreHeader } from '../store/store.component';
import { startWith } from 'rxjs/operators';

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
export class EnterpriseHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.css'],
  providers: [DecimalPipe]
})
export class EnterpriseComponent implements OnInit {

  orders: Array<any>;
  orders$: BehaviorSubject<Array<any>>;

  filter = new FormControl('');

  @ViewChildren(StoreHeader) headers: QueryList<StoreHeader>;

  constructor(private router: Router,
              pipe: DecimalPipe,
              private enterpriseService: EnterpriseService) {

    this.filter.valueChanges.subscribe(text => {
      startWith('');

      let result = this.orders.filter(order => {
        const term = text.toLowerCase();
        return order.name.toLowerCase().includes(term)
            || pipe.transform(order.time).includes(term)
            || pipe.transform(order.quantity).includes(term);
      });

      this.orders$.next(result);
    });
  }

  ngOnInit(): void {
    this.enterpriseService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.orders$ = new BehaviorSubject<Array<any>>(orders);
    });
  }

  accept(id, order): void {
    this.enterpriseService.accept(id, order).subscribe(data => {
      this.enterpriseService.getOrders().subscribe(orders => {
        this.orders = orders;
        this.orders$ = new BehaviorSubject<Array<any>>(orders);
      });
    });
  }

  cancle(id, order): void {
    this.enterpriseService.cancle(id, order).subscribe(data => {
      this.enterpriseService.getOrders().subscribe(orders => {
        this.orders = orders;
        this.orders$ = new BehaviorSubject<Array<any>>(orders);
      });
    });
  }

  deliver(id, order): void {
    this.enterpriseService.deliver(id, order).subscribe(data => {
      this.enterpriseService.getOrders().subscribe(orders => {
        this.orders = orders;
        this.orders$ = new BehaviorSubject<Array<any>>(orders);
      });
    });
  }

  onSort({ column, direction }: SortEvent) {

    // Resetting other headers.
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // Sorting orders.
    if (direction === '' || column === '') {
      this.enterpriseService.getOrders().subscribe(orders => this.orders$.next(orders));
    } else {
      let orders = [...this.orders$.value].sort((a, b) => {
        const res = compare(`${a[column]}`, `${b[column]}`);
        return direction === 'asc' ? res : -res;
      });
      this.orders$.next(orders);
    }
  }

}
