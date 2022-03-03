import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2YaTableCellTemplateDirective } from './ng2-ya-table-cell-template.directive';

@Component({
  template: `
    <ng-template ng2YaTableCellTemplate="template"
      ><p>Template!</p></ng-template
    >
    <ng-container [ngTemplateOutlet]="getTemplate()"></ng-container>
  `
})
class TestComponent {
  @ViewChild(Ng2YaTableCellTemplateDirective, { static: true })
  directive: Ng2YaTableCellTemplateDirective;

  getTemplate() {
    return this.directive.templateRef;
  }
}

describe('Ng2YaTableCellTemplateDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, Ng2YaTableCellTemplateDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.directive).toBeTruthy();
    expect(component.directive.ng2YaTableCellTemplate).toEqual('template');
    expect(component.directive.templateRef.elementRef).toBeTruthy();
    const p: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(p).toBeTruthy();
    expect(p.innerHTML).toEqual('Template!');
  });
});
