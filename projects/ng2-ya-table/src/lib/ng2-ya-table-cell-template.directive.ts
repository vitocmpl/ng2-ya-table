import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ng2YaTableCellTemplate]'
})
export class Ng2YaTableCellTemplateDirective {

  @Input() public ng2YaTableCellTemplate: string;

  constructor(public templateRef: TemplateRef<any>) { }
}
