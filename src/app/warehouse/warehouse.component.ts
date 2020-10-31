import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChildren, QueryList, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgriculturistService } from '../services/agriculturist.service';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { startWith } from 'rxjs/operators';
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
export class WarehouseHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
  providers: [DecimalPipe]
})
export class WarehouseComponent implements OnInit {

  warehouse: Array<Product>;
  warehouse$: BehaviorSubject<Array<Product>>;
  filter = new FormControl('');

  @ViewChildren(WarehouseHeader) headers: QueryList<WarehouseHeader>;

  constructor(pipe: DecimalPipe,
              public toastService: ToastService,
              private route: ActivatedRoute,
              private agriculturistService: AgriculturistService) {

    this.filter.valueChanges.subscribe(text => {
      startWith('');

      let result = this.warehouse.filter(product => {
        const term = text.toLowerCase();
        return product.name.toLowerCase().includes(term)
            || product.manufacturer.toLowerCase().includes(term)
            || pipe.transform(product.quantity).includes(term);
      });

      this.warehouse$.next(result);
    });
  }

  ngOnInit(): void {
    this.agriculturistService.getGardens().subscribe(gardens => {
      this.toastService.update(gardens);
    });
    this.agriculturistService.getWarehouse(this.route.snapshot.paramMap.get('id')).subscribe(warehouse => {
      this.warehouse = warehouse;
      this.warehouse$ = new BehaviorSubject<Array<Product>>(warehouse);
    });
  }

  onSort({ column, direction }: SortEvent) {

    // Resetting other headers.
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // Sorting warehouse.
    if (direction === '' || column === '') {
      this.agriculturistService.getWarehouse(this.route.snapshot.paramMap.get('id')).subscribe(warehouse => this.warehouse$.next(warehouse));
    } else {
      let warehouse = [...this.warehouse$.value].sort((a, b) => {
        const res = compare(`${a[column]}`, `${b[column]}`);
        return direction === 'asc' ? res : -res;
      });
      this.warehouse$.next(warehouse);
    }
  }

  cancle(id): void {
    this.agriculturistService.cancle(id, this.route.snapshot.paramMap.get('id')).subscribe(data => {
      this.agriculturistService.getWarehouse(this.route.snapshot.paramMap.get('id')).subscribe(warehouse => {
        this.warehouse = warehouse;
        this.warehouse$ = new BehaviorSubject<Array<Product>>(warehouse);
      });
    });
  }

}
