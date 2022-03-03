import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DataSourceService } from './data-source.service';
import { AppComponent } from './app.component';
import {
  DatasourceResult,
  TableColumnFilterList,
  TableColumnFilterListItem
} from 'ng2-ya-table';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    const dataSourceServiceStub: Partial<DataSourceService> = {
      getCities: jest.fn().mockReturnValue(of(['Rome'])),
      getUsersDataSource: jest.fn().mockReturnValue(of(null))
    };

    TestBed.overrideComponent(AppComponent, {
      set: {
        providers: [
          {
            provide: DataSourceService,
            useValue: dataSourceServiceStub
          }
        ]
      }
    });

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    const ds: Observable<DatasourceResult> = component.datasource({
      start: 0,
      length: 10,
      filters: [],
      orders: [],
      fullTextFilter: ''
    });
    let result: DatasourceResult = null;
    ds.subscribe((r) => (result = r));
    flush();
    expect(result).toBeNull();

    const cityColConfig = component.columns.find(
      (c) => c.name === 'address.city'
    ).filter.config as TableColumnFilterList;
    let cityResult: TableColumnFilterListItem[] = [];
    (cityColConfig.list as Observable<TableColumnFilterListItem[]>).subscribe(
      (r) => (cityResult = r)
    );
    flush();
    expect(cityResult).toEqual([{ value: 'Rome', text: 'Rome' }]);

    expect(component).toBeTruthy();
  }));

  it('should display alert', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.onActionClick(1);
    expect(window.alert).toHaveBeenCalled();
  });
});
