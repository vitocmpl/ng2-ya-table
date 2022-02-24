import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';

@Directive({selector: '[ng2YaTableSorting]'})
export class Ng2YaTableSortingDirective {

  @Input('ng2YaTableSorting') column: ColumnState;
  @Output() toggled = new EventEmitter<boolean>();

  @HostListener('click', ['$event'])
  onToggleSort(event: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.toggled.emit(event.shiftKey);
  }

  @HostListener('mousedown', ['$event'])
  onDisableMouseDown(event: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
  }
}