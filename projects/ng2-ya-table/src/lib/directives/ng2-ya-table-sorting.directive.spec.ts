import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2YaTableSortingDirective } from './ng2-ya-table-sorting.directive';

@Component({
  template: `
    <p [ng2YaTableSorting]="true" (toggled)="toggled($event)">Sorting!</p>
  `
})
class TestComponent {
  sort = 1;
  shift = false;
  toggled(event: boolean) {
    this.shift = event;
    this.sort = this.sort * -1;
  }
}

describe('Ng2YaTableCellTemplateDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, Ng2YaTableSortingDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort -1 when clicked', () => {
    const p: HTMLElement = fixture.nativeElement.querySelector('p');

    p.dispatchEvent(new Event('mousedown'));
    p.click();
    fixture.detectChanges();

    expect(component.sort).toEqual(-1);
  });

  it('should sort +1 when clicked twice', () => {
    const p: HTMLElement = fixture.nativeElement.querySelector('p');

    p.dispatchEvent(new Event('mousedown'));
    p.click();
    fixture.detectChanges();
    p.dispatchEvent(new Event('mousedown'));
    p.click();
    fixture.detectChanges();

    expect(component.sort).toEqual(1);
  });

  it('should shift true when clicked', () => {
    const p: HTMLElement = fixture.nativeElement.querySelector('p');

    p.dispatchEvent(new MouseEvent('click', { shiftKey: true }));
    fixture.detectChanges();

    expect(component.shift).toEqual(true);

    p.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.shift).toEqual(false);
  });
});
