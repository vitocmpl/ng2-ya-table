import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';

@Component({
  selector: 'ng2-ya-table-filter-default',
  template: `
    <input class="form-control" style="width: 100%"
      [attr.type]="column.def.filter.config && column.def.filter.config.type ? column.def.filter.config.type : 'text'"
      [attr.placeholder]="column.def.filter.config && column.def.filter.config.placeholder ? column.def.filter.config.placeholder : ''"
      [attr.max]="column.def.filter.config && column.def.filter.config.max ? column.def.filter.config.max : 524288"
      [attr.min]="column.def.filter.config && column.def.filter.config.min ? column.def.filter.config.min : 0"
      [attr.step]="column.def.filter.config && column.def.filter.config.step ? column.def.filter.config.step : 1"
      [formControl]="filter" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2YaTableFilteringDefaultComponent implements OnInit, OnDestroy {

  private subsription = new Subscription();

  @Input() public column: ColumnState;

  filter = new FormControl('');

  constructor(private state : Ng2YaTableService) { 
    this.subsription.add(this.filter.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      this.column.filterValue = filterValue;
      this.state.changeFilter(this.column);
    }));
  }

  ngOnInit(): void {
    this.filter.setValue(this.column.filterValue, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.subsription.unsubscribe();
  }
}
