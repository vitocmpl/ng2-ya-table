import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TableColumnFilterList } from './ng2-ya-table-interfaces';
import { ColumnState } from './ng2-ya-table.service';

@Component({
  selector: 'ng2-ya-table-filter-list',
  templateUrl: './ng2-ya-table-filtering-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2YaTableFilteringListComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  
  @Input() column: ColumnState;
  @Output() filterValueChanged = new EventEmitter();

  filter = new FormControl('');
  config: TableColumnFilterList;

  ngOnInit(): void {
    this.config = this.column.def.filter.config as TableColumnFilterList;

    this.subscription.add(this.filter.valueChanges.subscribe(filterValue => {
      this.filterValueChanged.emit(filterValue);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}