import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import {
  DatasourceResult,
  LanguageMap,
  TableColumn
} from './ng2-ya-table-interfaces';
import { Languages } from './ng2-ya-table-languages';
import { Ng2YaTableComponent } from './ng2-ya-table.component';
import { Ng2YaTableService } from './services/ng2-ya-table.service';

describe('Ng2YaTableComponent', () => {
  let component: Ng2YaTableComponent;
  let fixture: ComponentFixture<Ng2YaTableComponent>;
  let columns: TableColumn[];
  let users: unknown[];
  let serviceStub: Partial<Ng2YaTableService>;

  beforeEach(async () => {
    serviceStub = {
      setDataSource: jest.fn(),
      setColumns: jest.fn(),
      setPaging: jest.fn(),
      request: jest.fn(),
      result$: of(null),
      processing$: of(false),
      interpolateLocalization: jest.fn(),
      toggleSort: jest.fn(),
      changeFilter: jest.fn()
    };

    TestBed.overrideComponent(Ng2YaTableComponent, {
      set: {
        providers: [
          {
            provide: Ng2YaTableService,
            useValue: serviceStub
          }
        ]
      }
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [Ng2YaTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Ng2YaTableComponent);
    component = fixture.componentInstance;

    columns = [
      {
        name: 'name',
        filter: {
          controlType: 'default',
          config: {
            placeholder: 'Filter by name'
          }
        },
        sortOrder: 'asc'
      },
      {
        name: 'address.city',
        filter: {
          controlType: 'default',
          config: {
            nullText: 'Select a city',
            list: [
              { value: 'Konohagakure', text: 'Konohagakure' },
              { value: 'Sunagakure', text: 'Sunagakure' }
            ]
          }
        },
        filterValue: '',
        sortOrder: 'asc'
      }
    ];

    users = [
      {
        id: 1,
        name: 'Naruto Uzumaki',
        address: {
          city: 'Konohagakure'
        }
      },
      {
        id: 2,
        name: 'Gaara',
        address: {
          city: 'Sunagakure'
        }
      }
    ];

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    fixture.detectChanges();

    //search
    const searchDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-search'
    );
    expect(searchDiv).toBeTruthy();
    const input: HTMLInputElement = searchDiv.querySelector('.form-control');
    expect(input).toBeTruthy();
    expect(input.placeholder).toEqual(Languages['en'].search as string);

    //table
    const table: HTMLTableElement = fixture.nativeElement.querySelector(
      '.ng2-ya-table-table'
    );
    expect(table).toBeTruthy();
    expect(table.className).toEqual('table ng2-ya-table-table');
    expect(table.rows.length).toEqual(1);
    expect(table.rows.item(0).cells.length).toEqual(0);

    //pagination result
    const paginationResultDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-pagination-result'
    );
    expect(paginationResultDiv).toBeFalsy();

    //pagination
    const paginationDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-pagination'
    );
    expect(paginationDiv).toBeFalsy();
  });

  it('should create with rows and cols', () => {
    const setColumnsSpy = jest
      .spyOn(serviceStub, 'setColumns')
      .mockImplementation((c) => (serviceStub.columns = c));

    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation(
        (v: unknown[]) =>
          (serviceStub.result$ = of({
            data: v,
            recordsFiltered: 2,
            recordsTotal: 2
          }))
      );

    component.columns = columns;
    component.datasource = users;

    fixture.detectChanges();

    expect(setColumnsSpy).toHaveBeenCalled();
    expect(setDatasourceSpy).toHaveBeenCalled();

    //table
    const table: HTMLTableElement = fixture.nativeElement.querySelector(
      '.ng2-ya-table-table'
    );
    expect(table).toBeTruthy();
    expect(table.rows.length).toEqual(4);
    expect(table.rows.item(0).cells.length).toEqual(2);

    //pagination result
    const paginationResultDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-pagination-result'
    );
    expect(paginationResultDiv).toBeTruthy();

    //pagination
    const paginationDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-pagination'
    );
    expect(paginationDiv).toBeTruthy();
  });

  it('should create with no paging', () => {
    const setPagingSpy = jest.spyOn(serviceStub, 'setPaging');

    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation(
        (v: unknown[]) =>
          (serviceStub.result$ = of({
            data: v,
            recordsFiltered: 2,
            recordsTotal: 2
          }))
      );

    component.datasource = users;
    component.paging = {
      itemsPerPage: 100,
      itemsPerPageOptions: [],
      showPaging: false,
      maxSize: 0
    };

    fixture.detectChanges();

    expect(setPagingSpy).toHaveBeenCalled();
    expect(setDatasourceSpy).toHaveBeenCalled();

    //pagination result
    const paginationResultDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-pagination-result'
    );
    expect(paginationResultDiv).toBeTruthy();
    //pagination
    const paginationDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-pagination'
    );
    expect(paginationDiv).toBeFalsy();
  });

  it('should create with no options', () => {
    component.options = {};
    fixture.detectChanges();
    //search
    const searchDiv = fixture.nativeElement.querySelector(
      '.ng2-ya-table-search'
    );
    expect(searchDiv).toBeFalsy();
    expect((component.language as LanguageMap).search as string).toEqual(
      'Search...'
    );
  });

  it('onPageChanged should change rows', () => {
    const resultSubjec$ = new BehaviorSubject<DatasourceResult>({
      data: [users[0]],
      recordsFiltered: 2,
      recordsTotal: 2
    });
    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation(
        () => (serviceStub.result$ = resultSubjec$.asObservable())
      );

    const interpolateLocalizationSpy = jest
      .spyOn(serviceStub, 'interpolateLocalization')
      .mockImplementation(
        (s, params: { start: number; end: number; total: number }) =>
          `${params.start} - ${params.end} - ${params.total}`
      );

    component.paging = {
      itemsPerPage: 1,
      itemsPerPageOptions: [],
      showPaging: true,
      maxSize: 5
    };
    component.datasource = users;

    fixture.detectChanges();

    expect(setDatasourceSpy).toHaveBeenCalled();
    expect(interpolateLocalizationSpy).toHaveBeenCalled();

    //table
    const table: HTMLTableElement = fixture.nativeElement.querySelector(
      '.ng2-ya-table-table'
    );
    expect(table).toBeTruthy();
    expect(table.rows.length).toEqual(2);

    //pagination result
    const paginationResultDiv: HTMLElement =
      fixture.nativeElement.querySelector('.ng2-ya-table-pagination-result');
    expect(paginationResultDiv).toBeTruthy();
    expect(paginationResultDiv.innerHTML).toEqual('<span>1 - 1 - 2</span>');

    component.onPageChanged({ page: 2, itemsPerPage: 1 });
    resultSubjec$.next({
      data: [users[1]],
      recordsFiltered: 2,
      recordsTotal: 2
    });
    fixture.detectChanges();

    expect(component.currentPage).toEqual(2);
    expect(table.rows.length).toEqual(2);
    expect(paginationResultDiv.innerHTML).toEqual('<span>2 - 2 - 2</span>');
  });

  it('fullTextFilter valueChanges should change rows', fakeAsync(() => {
    const resultSubjec$ = new BehaviorSubject<DatasourceResult>({
      data: users,
      recordsFiltered: 2,
      recordsTotal: 2
    });
    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation(
        () => (serviceStub.result$ = resultSubjec$.asObservable())
      );
    const setColumnsSpy = jest
      .spyOn(serviceStub, 'setColumns')
      .mockImplementation((c) => (serviceStub.columns = c));

    component.columns = columns;
    component.datasource = users;

    fixture.detectChanges();

    expect(setDatasourceSpy).toHaveBeenCalled();
    expect(setColumnsSpy).toHaveBeenCalled();
    expect(component.rows.length).toEqual(2);

    //table
    const table: HTMLTableElement = fixture.nativeElement.querySelector(
      '.ng2-ya-table-table'
    );
    expect(table).toBeTruthy();
    expect(table.rows.length).toEqual(4);

    component.fullTextFilter.setValue('Naruto');
    tick(300);
    resultSubjec$.next({
      data: [users[0]],
      recordsFiltered: 1,
      recordsTotal: 2
    });
    fixture.detectChanges();

    expect(table.rows.length).toEqual(3);
    expect(table.rows.item(0).cells.length).toEqual(2);
    expect(table.rows.item(2).cells[0].children[0].innerHTML).toEqual(
      'Naruto Uzumaki'
    );
  }));

  it('onToggleSort should change rows', () => {
    const resultSubjec$ = new BehaviorSubject<DatasourceResult>({
      data: users,
      recordsFiltered: 2,
      recordsTotal: 2
    });
    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation(
        () => (serviceStub.result$ = resultSubjec$.asObservable())
      );
    const setColumnsSpy = jest
      .spyOn(serviceStub, 'setColumns')
      .mockImplementation((c) => (serviceStub.columns = c));

    component.datasource = users;
    component.columns = columns;

    fixture.detectChanges();

    expect(setDatasourceSpy).toHaveBeenCalled();
    expect(setColumnsSpy).toHaveBeenCalled();
    expect(component.rows.length).toEqual(2);

    //table
    const table: HTMLTableElement = fixture.nativeElement.querySelector(
      '.ng2-ya-table-table'
    );
    expect(table).toBeTruthy();
    expect(table.rows.length).toEqual(4);
    expect(table.rows[0].cells.length).toEqual(2);
    expect(table.rows[0].cells[0].className).toEqual('sorting-asc');

    const toggleSortSpy = jest
      .spyOn(serviceStub, 'toggleSort')
      .mockImplementation((c) => (c.sortOrder = 'desc'));

    component.onToggleSort(columns[0], false);
    resultSubjec$.next({
      data: users,
      recordsFiltered: 2,
      recordsTotal: 2
    });
    fixture.detectChanges();

    expect(toggleSortSpy).toHaveBeenCalled();
    expect(table.rows[0].cells[0].className).toEqual('sorting-desc');

    const otherToggleSortSpy = toggleSortSpy.mockImplementation(
      (c) => (c.sortOrder = 'asc')
    );
    component.onToggleSort(columns[1], true);
    fixture.detectChanges();

    expect(otherToggleSortSpy).toHaveBeenCalled();
    expect(table.rows[0].cells[0].className).toEqual('sorting-desc');
    expect(table.rows[0].cells[1].className).toEqual('sorting-asc');
  });

  it('onChangeFilter should change rows', () => {
    const resultSubjec$ = new BehaviorSubject<DatasourceResult>({
      data: users,
      recordsFiltered: 2,
      recordsTotal: 2
    });
    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation(
        () => (serviceStub.result$ = resultSubjec$.asObservable())
      );
    const setColumnsSpy = jest
      .spyOn(serviceStub, 'setColumns')
      .mockImplementation((c) => (serviceStub.columns = c));

    component.columns = columns;
    component.datasource = users;

    fixture.detectChanges();

    expect(setDatasourceSpy).toHaveBeenCalled();
    expect(setColumnsSpy).toHaveBeenCalled();
    expect(component.rows.length).toEqual(2);

    //table
    const table: HTMLTableElement = fixture.nativeElement.querySelector(
      '.ng2-ya-table-table'
    );
    expect(table).toBeTruthy();
    expect(table.rows.length).toEqual(4);

    const changeFilterSpy = jest
      .spyOn(serviceStub, 'changeFilter')
      .mockImplementation((c) => (c.filterValue = 'Sunaga'));

    component.onChangeFilter(columns[1], 'Sunaga');
    resultSubjec$.next({
      data: [users[1]],
      recordsFiltered: 1,
      recordsTotal: 2
    });
    fixture.detectChanges();

    expect(changeFilterSpy).toHaveBeenCalled();
    expect(table.rows.length).toEqual(3);
    expect(table.rows.item(0).cells.length).toEqual(2);
    expect(table.rows.item(2).cells[1].children[0].innerHTML).toEqual(
      'Sunagakure'
    );
  });

  it('refresh should change rows', () => {
    let datasource: unknown[] = [];
    const setDatasourceSpy = jest
      .spyOn(serviceStub, 'setDataSource')
      .mockImplementation((ds: unknown[]) => (datasource = ds));

    const requestSpy = jest
      .spyOn(serviceStub, 'request')
      .mockImplementation(() => (component.rows = datasource));

    component.datasource = [users[0]];
    fixture.detectChanges();

    component.datasource = [users[1]];
    component.refresh();
    fixture.detectChanges();
    expect(setDatasourceSpy).toHaveBeenCalledTimes(2);
    expect(requestSpy).toHaveBeenCalledTimes(3);
    expect(component.rows.length).toEqual(1);
  });
});
