import { Directive, Input, HostListener } from '@angular/core';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';

@Directive({selector: '[ng2YaTableSorting]'})
export class Ng2YaTableSortingDirective {

  constructor(private service: Ng2YaTableService) { }

  @Input('ng2YaTableSorting') 
  column: ColumnState;

  @HostListener('click', ['$event'])
  onToggleSort(event: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.service.toggleSort(this.column, event.shiftKey);
  }

  @HostListener('mousedown', ['$event'])
  onDisableMouseDown(event: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
  }
}