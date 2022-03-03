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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  TableColumn,
  TableColumnFilterDefault
} from './ng2-ya-table-interfaces';

@Component({
  selector: 'ng2-ya-table-filter-default',
  templateUrl: './ng2-ya-table-filtering-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2YaTableFilteringDefaultComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  @Input() column: TableColumn;
  @Output() filterValueChanged = new EventEmitter();

  filter = new FormControl('');
  config: TableColumnFilterDefault;

  ngOnInit(): void {
    this.config = this.column.filter.config as TableColumnFilterDefault;

    this.subscription.add(
      this.filter.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((filterValue) => {
          this.filterValueChanged.emit(filterValue);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
