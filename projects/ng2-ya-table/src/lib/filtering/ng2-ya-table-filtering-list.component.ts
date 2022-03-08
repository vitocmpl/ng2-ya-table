import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  TableColumn,
  TableColumnFilterList,
  TableColumnFilterListItem
} from '../ng2-ya-table-interfaces';

@Component({
  selector: 'ng2-ya-table-filter-list',
  templateUrl: './ng2-ya-table-filtering-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2YaTableFilteringListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  @Input() column: TableColumn;
  @Output() filterValueChanged = new EventEmitter();

  filter = new FormControl('');
  config: TableColumnFilterList;
  items: TableColumnFilterListItem[] = [];

  ngOnInit(): void {
    this.config = this.column.filter.config as TableColumnFilterList;

    if (this.config.list instanceof Array) {
      this.items = this.config.list;
    } else {
      this.subscription.add(
        this.config.list.subscribe((items) => {
          this.items = items;
        })
      );
    }

    this.subscription.add(
      this.filter.valueChanges.subscribe((filterValue) => {
        this.filterValueChanged.emit(filterValue);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
