import { Injectable } from '@angular/core';
import { DatasourceParameters } from 'dist/ng2-ya-table/public-api';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TableColumn, SORT_ORDER, TableDataSource, DatasourceOrder, DatasourceFilter } from './ng2-ya-table-interfaces';
import { Ng2YaTableLocalDataSource } from './ng2-ya-table.localdatasouce';

export interface ColumnState {
  filterValue : any;
  sortOrder : SORT_ORDER;
  def : TableColumn;
  hasSort : boolean;
  hasFilter : boolean;
}

const sortCycle : SORT_ORDER[] = ['asc', 'desc', null];
const getNextSortOrder = (currentSortOrder : SORT_ORDER) : SORT_ORDER =>  {
  const nextIndex = (sortCycle.indexOf(currentSortOrder) + 1) % sortCycle.length;
  return sortCycle[nextIndex];
};

const defaultRequestParams : DatasourceParameters = {
  start: 0,
  length: 10,
  filters: [],
  orders: [],
  fullTextFilter: ""
};

@Injectable()
export class Ng2YaTableService {

  private localizationInterpolationMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;
  private lastRequestParams = defaultRequestParams;
  
  private dataSource: TableDataSource;
  private requestSubject$ = new Subject<DatasourceParameters>();
  private processingSubject$ = new Subject<boolean>();
  
  columns: ColumnState[] = [];
  sortStack: ColumnState[] = [];

  result$ = this.requestSubject$.pipe(
    tap(() => this.processingSubject$.next(true)),
    switchMap(request => {
      return this.dataSource(request);
    }),
    tap(() => this.processingSubject$.next(false))
  );

  processing$ = this.processingSubject$.asObservable();

  setDataSource(datasource: TableDataSource | any[]) {
    const needRequest = !!this.dataSource;
    if (datasource instanceof Array) {
      this.dataSource = new Ng2YaTableLocalDataSource(datasource).toDataSource();
    } else {
      this.dataSource = datasource;
    }
    if(needRequest) {
      this.request({});
    }
  }

  setColumns(columns : TableColumn[]): void {
    this.columns = columns.map(c => {

      let column: ColumnState = {
        filterValue: null,
        sortOrder: c.defaultSortOrder,
        def: c,
        hasSort: c.sort,
        hasFilter: !!c.filter
      };

      if(!!column.sortOrder){
        this.sortStack.push(column);
      }

      return column;
    });
  }

  request(parameters: Partial<DatasourceParameters>) {
    this.lastRequestParams = { ...this.lastRequestParams, ...parameters };
    this.requestSubject$.next(this.lastRequestParams);
  }

  toggleSort(column : ColumnState, orderMulti : boolean): void {
    column.sortOrder = getNextSortOrder(column.sortOrder);

    if (orderMulti) {
      let curIndex : number = this.sortStack.indexOf(column);
      if (curIndex === -1) {
        this.sortStack.push(column);
      } else if (!column.sortOrder) {
        this.sortStack.splice(curIndex, 1);
      }
    } else {
      this.sortStack = column.sortOrder ? [column] : [];
      this.columns.forEach((c) => {
        if (c !== column) {
          c.sortOrder = null;
        }
      });
    }

    this.request({
      orders:  this.sortStack.map(column => {
        const order: DatasourceOrder = {
          dir: column.sortOrder,
          name: column.def.name
        };
        return order;
      })
    });
  }
 
  changeFilter(column: ColumnState, filterValue: any) {
    column.filterValue = filterValue;

    this.request({
      filters: this.columns.filter(c => c.hasFilter).map(column => {
        const filter: DatasourceFilter = {
          name: column.def.name,
          type: column.def.filter.type,
          value: column.filterValue
        };
        return filter;
      })
    });
  }

  interpolateLocalization(str: string, params: any) {
    return str.replace(this.localizationInterpolationMatcher, (substring: string, b: string) => {
      let r = params[b];
      return !!r ? r : substring;
    });
  }
}
