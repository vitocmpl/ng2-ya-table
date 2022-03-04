import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2YaTableFilteringDefaultComponent } from './ng2-ya-table-filtering-default.component';
import { TableColumn } from '../ng2-ya-table-interfaces';

describe('Ng2YaTableFilteringDefaultComponent', () => {
  let component: Ng2YaTableFilteringDefaultComponent;
  let fixture: ComponentFixture<Ng2YaTableFilteringDefaultComponent>;
  let column: TableColumn;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Ng2YaTableFilteringDefaultComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Ng2YaTableFilteringDefaultComponent);
    component = fixture.componentInstance;

    column = {
      name: 'name',
      filter: {
        controlType: 'default',
        config: {
          placeholder: 'Filter by name'
        }
      },
      filterValue: '',
      sortOrder: 'asc'
    };

    component.column = column;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    fixture.detectChanges();
    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector('.form-control');

    expect(inputElement).toBeTruthy();
    expect(inputElement.placeholder).toEqual('Filter by name');
    expect(inputElement.type).toEqual('text');
  });

  it('should create with number input', () => {
    component.column = {
      ...column,
      filter: {
        ...column.filter,
        config: {
          ...column.filter.config,
          type: 'number',
          min: 10,
          max: 100,
          step: 10
        }
      }
    };

    fixture.detectChanges();
    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector('.form-control');

    expect(inputElement).toBeTruthy();
    expect(inputElement.type).toEqual('number');
    expect(inputElement.min).toEqual('10');
    expect(inputElement.max).toEqual('100');
    expect(inputElement.step).toEqual('10');
  });

  it('should filterValueChanged emit value', fakeAsync(() => {
    const spy = jest.spyOn(component.filterValueChanged, 'emit');

    component.filter.setValue('hello');
    tick(300);
    expect(spy).toHaveBeenCalled();
  }));

  it('should filterValueChanged emit one value', fakeAsync(() => {
    const spy = jest.spyOn(component.filterValueChanged, 'emit');

    component.filter.setValue('hel');
    tick(100);
    component.filter.setValue('hello');
    tick(300);

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should filterValueChanged emit two value', fakeAsync(() => {
    const spy = jest.spyOn(component.filterValueChanged, 'emit');

    component.filter.setValue('hello');
    tick(300);
    component.filter.setValue('world');
    tick(300);

    expect(spy).toHaveBeenCalledTimes(2);
  }));
});
