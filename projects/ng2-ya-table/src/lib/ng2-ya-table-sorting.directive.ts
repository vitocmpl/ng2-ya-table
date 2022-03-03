import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ColumnState } from './ng2-ya-table.service';

@Directive({selector: '[ng2YaTableSorting]'})
export class Ng2YaTableSortingDirective {

  @Input('ng2YaTableSorting') enabled = false;
  @Output() toggled = new EventEmitter<boolean>();

  @HostListener('click', ['$event'])
  onToggleSort(event: MouseEvent): void {
    if (this.enabled) {
      event.preventDefault();
      this.toggled.emit(event.shiftKey);
    }
  }

  @HostListener('mousedown', ['$event'])
  onDisableMouseDown(event: MouseEvent): void {
    if (this.enabled) {
      event.preventDefault();
    }
  }
}