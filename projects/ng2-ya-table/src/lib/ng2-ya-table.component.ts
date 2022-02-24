import { Component, Input, OnInit, OnDestroy, ContentChildren, QueryList, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatasourceOrder, DatasourceFilter, DatasourceParameters, DatasourceResult, TableDataSource, TableOptions, TableColumn, TablePaging } from './ng2-ya-table-interfaces';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';
import { Ng2YaTableLocalDataSource } from './ng2-ya-table.localdatasouce';
import { Ng2YaTableCellTemplateDirective } from './ng2-ya-table-cell-template.directive';

@Component({
  selector: 'ng2-ya-table',
  templateUrl: './ng2-ya-table.component.html',
  styleUrls: ['./ng2-ya-table.component.scss'],
  providers: [Ng2YaTableService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class Ng2YaTableComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  private _options : TableOptions = null;
  private _datasource: TableDataSource | any[] = null;
  private _columns: TableColumn[] = [];
  private _paging: TablePaging = null;

  processing:boolean = false;
  itemsPerPage= new FormControl(0);
  currentPage = new FormControl(1);
  fullTextFilter = new FormControl('');
  rows = [];

  @Input() set options(value: TableOptions) {
    this._options = value;
    this.state.setOptions(value);
  }
  get options(): TableOptions {
    return this._options;
  }

  @Input() set datasource(value: TableDataSource | any[]) {
    this._datasource = value;
  }
  get datasource(): TableDataSource | any[] {
    return this._datasource;
  }
  
  @Input() set columns(value: TableColumn[]) {
    this._columns = value;
    this.state.setColumns(value);
  }
  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() set paging(value: TablePaging) {
    this._paging = value;
    this.state.setPaging(value);
    this.itemsPerPage.setValue(this.paging.itemsPerPage, { emitEvent: false });
  }
  get paging(): TablePaging {
    return this._paging;
  }

  @ContentChildren(Ng2YaTableCellTemplateDirective) cellTemplates: QueryList<Ng2YaTableCellTemplateDirective>;

  public constructor(public state: Ng2YaTableService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription.add(this.state.stateChanged$.subscribe(() => this.onChangeTable()));
    
    this.subscription.add(this.itemsPerPage.valueChanges.subscribe(p => {
      this.state.paging.itemsPerPage = p;
      this.currentPage.setValue(1);
    }));

    this.subscription.add(this.fullTextFilter.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => { 
      this.state.fullTextFilter = filterValue;
      this.onChangeTable();
    }));

    this.subscription.add(this.currentPage.valueChanges.subscribe(p => { 
      this.state.changePaging(p);
    }));
  }

  ngOnDestroy () : void {
    this.subscription.unsubscribe();
  }

  public onChangeTable():void {
    if(this.datasource)
    {
      this.processing = true;

      let orders: Array<DatasourceOrder> = new Array<DatasourceOrder>();
      this.state.sortStack.forEach((column:ColumnState) => {
        let order: DatasourceOrder = {
          dir: column.sortOrder,
          name: column.def.name
        };
        orders.push(order);
      });

      let filters: Array<DatasourceFilter> = new Array<DatasourceFilter>();
      this.state.columns.forEach((column: ColumnState) => {
        if(column.hasFilter) {
          let filter: DatasourceFilter = {
            name: column.def.name,
            type: column.def.filter.type,
            value: column.filterValue
          };
          filters.push(filter);
        }
      });

      let request: DatasourceParameters = { 
        start: (this.state.paging.currentPage - 1) * this.state.paging.itemsPerPage, 
        length: this.state.paging.itemsPerPage,
        filters: filters,
        orders: orders,
        fullTextFilter: this.state.fullTextFilter
      };

      let observable: Observable<any> =  null;
      if (this.datasource instanceof Array) {
        observable = new Ng2YaTableLocalDataSource(this.datasource).asObservable(request);
      } else {
        observable = this.datasource(request);
      }

      observable.subscribe(
          (result: DatasourceResult) => {
            this.cdRef.markForCheck(); 
            this.rows = result.data;
            this.state.paging.recordsFiltered = result.recordsFiltered;
            this.state.paging.recordsTotal = result.recordsTotal;
          },
          error => {
            console.log(error);
          },
          () => {
            this.processing = false;
          }
      );
    }
  }

  public getData(row: any, propertyName: string): string {
    if(!!propertyName) {
      return propertyName.split('.').reduce((prev:any, curr:string) => prev[curr], row);
    }
    return null;
  }

  getCellTemplate(col: TableColumn, standardTemplate: TemplateRef<HTMLElement>): TemplateRef<HTMLElement> {
    if(!!col.template || !!col.name) {
      const templates = this.cellTemplates.filter(p => p.ng2YaTableCellTemplate === (!!col.template ? col.template : col.name));
      if (templates.length > 0) {
        return templates.map(p => p.templateRef)[0];
      }
    }
    return standardTemplate;
  }

  getPaginationResult() {
    return this.state.interpolateLocalization(this.state.language.info as string, {
      start: (this.state.paging.currentPage - 1) * this.state.paging.itemsPerPage + 1,
      end: (this.state.paging.currentPage - 1) * this.state.paging.itemsPerPage + this.rows.length,
      total: this.state.paging.recordsFiltered
    });
  }
}
