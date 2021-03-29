import { Directive, Input, HostListener } from '@angular/core';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';

@Directive({selector: '[ng2YaTableSorting]'})
export class Ng2YaTableSortingDirective {

  public constructor(private state: Ng2YaTableService) { }

  @Input('ng2YaTableSorting') 
  public column: ColumnState;

  @HostListener('click', ['$event'])
  public onToggleSort(event:any):void {
    if (event) {
      event.preventDefault();
    }
    this.state.toggleSort(this.column, event.shiftKey && this.state.orderMulti);
  }

  @HostListener('mousedown', ['$event'])
  public onDisableMouseDown(event:any):void {
    if (event) {
      event.preventDefault();
    }
  }
}