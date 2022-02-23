import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableOptions, TablePaging, TableColumn, SORT_ORDER } from './ng2-ya-table-interfaces';
import { Languages } from './ng2-ya-table-languages';

export interface PagingState {
  currentPage:number;
  itemsPerPage: number;
  recordsTotal: number; 
  recordsFiltered: number; 
}

export interface ColumnState {
  filterValue : any;
  sortOrder : SORT_ORDER;
  def : TableColumn;
  hasSort : boolean;
  hasFilter : boolean;
}

const sortCycle : SORT_ORDER[] = ['asc', 'desc', null];
const getNextSortOrder = (currentSortOrder : SORT_ORDER) : SORT_ORDER =>  {
  let nextIndex = (sortCycle.indexOf(currentSortOrder) + 1) % sortCycle.length;
  return sortCycle[nextIndex];
};

@Injectable()
export class Ng2YaTableService {
  private stateChangedSource : BehaviorSubject<Ng2YaTableService> = new BehaviorSubject<Ng2YaTableService>(this);
  
  stateChanged$: Observable<Ng2YaTableService>;
  showFilterRow: boolean = false;
  orderMulti: boolean = true;
  columns: ColumnState[];
  paging: PagingState;
  sortStack: ColumnState[] = [];
  fullTextFilter: string;
  language: any = null;

  constructor() {
    this.stateChanged$ = this.stateChangedSource.asObservable();
  }

  public setOptions(options: TableOptions): void{
    this.orderMulti = !!options.orderMulti ? options.orderMulti : true;
    this.language = typeof options.language ==="string" ? Languages[options.language] : options.language;
  }

  public setColumns (columns : Array<TableColumn>): void {
    this.columns = columns.map(c => {
      if (!!c.filter) {
        this.showFilterRow = true;
      }

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

  public setPaging(paging: TablePaging): void {
    this.paging = {
      currentPage: 1,
      itemsPerPage: paging.itemsPerPage,
      recordsTotal : 0,
      recordsFiltered: 0
    };
  }

  public toggleSort(colState : ColumnState, orderMulti : boolean): void {
    colState.sortOrder = getNextSortOrder(colState.sortOrder);

    if (orderMulti) {
      let curIndex : number = this.sortStack.indexOf(colState);
      if (curIndex === -1) {
        this.sortStack.push(colState);
      } else if (!colState.sortOrder) {
        this.sortStack.splice(curIndex, 1);
      }
    } else {
      this.sortStack = colState.sortOrder ? [colState] : [];
      this.columns.forEach((column) => {
        if (column !== colState) {
          column.sortOrder = null;
        }
      });
    }

    this.notify();
  }

  public changePaging(page: number){
      this.paging.currentPage = page;
      this.notify();
  }

  public changeFilter(column: ColumnState){
    this.paging.currentPage = 1;
    this.notify();
  }

  public notify () : void {
    this.stateChangedSource.next(this);
  }
}
