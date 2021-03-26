import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngTableCellTemplate]'
})
export class Ng2YaTableCellTemplateDirective {

  @Input() public ngTableCellTemplate: string;

  constructor(public templateRef: TemplateRef<any>) { }
}
