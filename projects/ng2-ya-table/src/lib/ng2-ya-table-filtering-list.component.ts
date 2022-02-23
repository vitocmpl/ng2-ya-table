import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';

@Component({
  selector: 'ng2-ya-table-filter-list',
  template: `
    <select class="form-control" style="width: 100%" [formControl]="filter">
      <option value="">{{ column.def.filter.configList.nullText }}</option>
      <option *ngFor="let item of column.def.filter.configList.list | async" [value]="item.value">{{ item.text }}</option>
    </select>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2YaTableFilteringListComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  
  @Input() public column: ColumnState;

  filter = new FormControl('');

  constructor(public state : Ng2YaTableService) {
    this.subscription.add(this.filter.valueChanges.subscribe(filterValue => {
      this.column.filterValue = filterValue;
      this.state.changeFilter(this.column);
    }));
  }

  ngOnInit(): void {
    this.filter.setValue(this.column.filterValue, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}