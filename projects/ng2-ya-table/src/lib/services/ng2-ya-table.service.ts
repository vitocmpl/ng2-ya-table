import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  DatasourceFilter,
  DatasourceOrder,
  DatasourceParameters,
  SORT_ORDER,
  TableColumn,
  TableDataSource
} from '../ng2-ya-table-interfaces';
import { Ng2YaTableLocalDataSource } from './ng2-ya-table.localdatasouce';

const sortCycle: SORT_ORDER[] = ['asc', 'desc', null];
const getNextSortOrder = (currentSortOrder: SORT_ORDER): SORT_ORDER => {
  const nextIndex =
    (sortCycle.indexOf(currentSortOrder) + 1) % sortCycle.length;
  return sortCycle[nextIndex];
};

const defaultRequestParams: DatasourceParameters = {
  start: 0,
  length: 10,
  filters: [],
  orders: [],
  fullTextFilter: ''
};

@Injectable()
export class Ng2YaTableService {
  private localizationInterpolationMatcher = /{{\s?([^{}\s]*)\s?}}/g;
  private lastRequestParams = defaultRequestParams;

  private dataSource: TableDataSource;
  private requestSubject$ = new Subject<DatasourceParameters>();
  private processingSubject$ = new Subject<boolean>();

  columns: TableColumn[] = [];
  sortStack: TableColumn[] = [];

  result$ = this.requestSubject$.pipe(
    tap(() => this.processingSubject$.next(true)),
    switchMap((request) => {
      return this.dataSource(request);
    }),
    tap(() => this.processingSubject$.next(false))
  );

  processing$ = this.processingSubject$.asObservable();

  setDataSource(datasource: TableDataSource | unknown[]) {
    if (datasource instanceof Array) {
      this.dataSource = new Ng2YaTableLocalDataSource(
        datasource
      ).toDataSource();
    } else {
      this.dataSource = datasource;
    }
  }

  setPaging(itemsPerPage: number) {
    this.lastRequestParams = {
      ...this.lastRequestParams,
      length: itemsPerPage
    };
  }

  setColumns(columns: TableColumn[]): void {
    this.columns = columns;
    this.sortStack = [...this.columns.filter((c) => !!c.sortOrder)];
    this.lastRequestParams = {
      ...this.lastRequestParams,
      orders: this.buildDatasourceOrders(),
      filters: this.buildDatasourceFilter()
    };
  }

  request(parameters: Partial<DatasourceParameters>) {
    this.lastRequestParams = { ...this.lastRequestParams, ...parameters };
    this.requestSubject$.next(this.lastRequestParams);
  }

  toggleSort(column: TableColumn, orderMulti: boolean): void {
    column.sortOrder = getNextSortOrder(column.sortOrder);

    if (orderMulti) {
      const curIndex: number = this.sortStack.indexOf(column);
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
      orders: this.buildDatasourceOrders()
    });
  }

  private buildDatasourceOrders(): DatasourceOrder[] {
    return this.sortStack.map((column) => {
      const order: DatasourceOrder = {
        dir: column.sortOrder,
        name: column.name
      };
      return order;
    });
  }

  changeFilter(column: TableColumn, filterValue: unknown) {
    column.filterValue = filterValue;

    this.request({
      filters: this.buildDatasourceFilter()
    });
  }

  private buildDatasourceFilter(): DatasourceFilter[] {
    return this.columns
      .filter((c) => !!c.filterValue)
      .map((column) => {
        const filter: DatasourceFilter = {
          name: column.name,
          value: column.filterValue
        };
        return filter;
      });
  }

  interpolateLocalization(str: string, params: unknown) {
    return str.replace(
      this.localizationInterpolationMatcher,
      (substring: string, b: string) => {
        const r = params[b];
        return r ? r : substring;
      }
    );
  }
}
