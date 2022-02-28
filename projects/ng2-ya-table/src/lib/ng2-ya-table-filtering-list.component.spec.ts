import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { Ng2YaTableFilteringListComponent } from './ng2-ya-table-filtering-list.component';
import { ColumnState } from './ng2-ya-table.service';

describe('Ng2YaTableFilteringDefaultComponent', () => {
  let component: Ng2YaTableFilteringListComponent;
  let fixture: ComponentFixture<Ng2YaTableFilteringListComponent>;
  let column: ColumnState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Ng2YaTableFilteringListComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();;

    fixture = TestBed.createComponent(Ng2YaTableFilteringListComponent);
    component = fixture.componentInstance;

    column = {
        def: { 
            name: 'city',
            filter: {
                type: 'default',
                controlType: 'default',
                config: {
                    nullText: 'Select a city',
                    list: of([{ value: 'Rome', text: 'Rome' }])
                }
            },
        },
        filterValue: '',
        hasFilter: true,
        hasSort: false,
        sortOrder: 'asc'
    };

    component.column = column;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    fixture.detectChanges();
    const selectElement: HTMLSelectElement = fixture.nativeElement.querySelector('.form-control');

    expect(selectElement).toBeTruthy();
    expect(selectElement.options.length).toEqual(2);
    expect(selectElement.options[0].value).toEqual('');
    expect(selectElement.options[0].text).toEqual('Select a city');
    expect(selectElement.options[1].value).toEqual('Rome');
    expect(selectElement.options[1].text).toEqual('Rome');
  });


  it('should filterValueChanged emit value', fakeAsync(() => {
    const spy = jest.spyOn(component.filterValueChanged, 'emit');

    component.filter.setValue('Rome');
    expect(spy).toHaveBeenCalled();
  }));
});
