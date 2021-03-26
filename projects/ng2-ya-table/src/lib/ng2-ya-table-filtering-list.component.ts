import { Component, Input } from '@angular/core';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';

@Component({
  selector: 'ng2-ya-table-filter-list',
  template: `
    <select class="form-control" style="width: 100%"
        [(ngModel)]="column.filterValue"
        (ngModelChange)="state.changeFilter(column)">
          <option value="">{{ column.def.filter.configList.nullText }}</option>
          <option *ngFor="let item of column.def.filter.configList.list" [value]="item.value">{{item.text}}</option>
    </select>`
})
export class Ng2YaTableFilteringListComponent {
  constructor(public state : Ng2YaTableService) {}
  
  @Input() public column: ColumnState;
}