import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({ selector: '[ng2YaTableSorting]' })
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
