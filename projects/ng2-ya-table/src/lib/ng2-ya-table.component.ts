import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatasourceOrder, DatasourceFilter, DatasourceParameters, DatasourceResult, TableDataSource, TableOptions, TableColumn, TablePaging } from './ng2-ya-table-interfaces';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';
import { Ng2YaTableLocalDataSource } from './ng2-ya-table.localdatasouce';
import { Ng2YaTableCellTemplateDirective } from './ng2-ya-table-cell-template.directive';

@Component({
  selector: 'ng2-ya-table',
  template: `
    <div class="ng2-ya-table_wrapper cointainer">
      <div class="row">
        <div class="col-6">
          <label *ngIf="paging.showPaging">
            <span *ngFor="let s of state.language.lengthMenu.split(' ')">
              <span [ngSwitch]="s">
                <select *ngSwitchCase="'_MENU_'" class="d-inline-block form-control input-sm" style="width:80px" [(ngModel)]="state.paging.itemsPerPage" (change)="state.changePaging(1, $event.target.value)">
                  <option *ngFor="let pn of paging.itemsPerPageOptions" [value]="pn">{{pn}}</option>
                </select>
                <span *ngSwitchDefault> {{s}} </span>
              </span>
            </span>
          </label>
        </div>
        <div class="col-6">
          <div *ngIf="options.search" class="float-right">
            <label>
              <span>{{state.language.search}} </span>
              <input type="search" class="d-inline-block form-control input-sm" style="width: auto"
                [(ngModel)]="state.fullTextFilter"
                (ngModelChange)="onFullTextFilterValueChange($event)"/>
            </label>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div *ngIf="processing" class="ng2-ya-table_processing">{{state.language.processing}}</div>
          <table class="table ng2-ya-table" ngClass="{{options.className || ''}}" role="grid">
            <thead>
              <tr role="row">
                <th *ngFor="let column of state.columns" 
                  [style.width]="column.def.width"
                  [ngClass]="{'sorting_desc': column.sortOrder === 'desc', 'sorting_asc': column.sortOrder === 'asc', 'sorting': column.hasSort }"
                  [ng2YaTableSorting]="column">
                  {{column.def.title}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="state.showFilterRow">
                <td *ngFor="let column of state.columns">
                  <div *ngIf="column.def.filter" [ngSwitch]="column.def.filter.controlType">
                    <ng2-ya-table-filter-list *ngSwitchCase="'list'" [column]="column"></ng2-ya-table-filter-list>
                    <ng2-ya-table-filter-default *ngSwitchDefault [column]="column"></ng2-ya-table-filter-default>
                  </div>
                </td>
              </tr>
              <tr *ngFor="let row of rows; index as i">
                <td (click)="cellClick(row, column)" *ngFor="let column of columns">
                  <ng-container
                    [ngTemplateOutlet]="getCellTemplate(column, standardCell)"
                    [ngTemplateOutletContext]="{
                        row: row,
                        rowIndex: i,
                        data: getData(row, column.name),
                        col: column
                      }">
                  </ng-container>
                  <ng-template #standardCell let-data="data" let-col="col">
                    <span>{{ getData(row, column.name) }}</span>
                  </ng-template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <div *ngIf="rows.length > 0" role="status">
            <span *ngFor="let s of state.language.info.split(' ')">
              <span [ngSwitch]="s">
                <span *ngSwitchCase="'_START_'">{{(state.paging.currentPage - 1) * state.paging.itemsPerPage + 1}} </span>
                <span *ngSwitchCase="'_END_'">{{(state.paging.currentPage - 1) * state.paging.itemsPerPage + rows.length}} </span>
                <span *ngSwitchCase="'_TOTAL_'">{{state.paging.recordsFiltered}} </span>
                <span *ngSwitchDefault>{{s}} </span>
              </span>
            </span>
          </div>
        </div>
        <div class="col-6">
          <div class="float-right">
            <pagination *ngIf="rows.length > 0"
              [(ngModel)]="state.paging.currentPage"
              [totalItems]="state.paging.recordsFiltered"
              [itemsPerPage]="state.paging.itemsPerPage"
              [maxSize]="paging.maxSize"
              [boundaryLinks]="false"
              [rotate]="false"
              (pageChanged)="state.changePaging($event.page, $event.itemsPerPage)"
              [firstText] = "state.language.pagination.first"
              [lastText] = "state.language.pagination.last"
              [nextText] = "state.language.pagination.next"
              [previousText] = "state.language.pagination.previous">
            </pagination>
          </div>
        </div>
      </div>
    </div>`,
  styles: [
    `div.ng2-ya-table_wrapper div.ng2-ya-table_processing {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      margin-left: -100px;
      margin-top: -26px;
      text-align: center;
      padding: 1em 0;
    }`,
    `table.ng2-ya-table thead > tr > th.sorting_asc, 
    table.ng2-ya-table thead > tr > th.sorting_desc, 
    table.ng2-ya-table thead > tr > th.sorting,
    table.ng2-ya-table thead > tr > td.sorting_asc,
    table.ng2-ya-table thead > tr > td.sorting_desc,
    table.ng2-ya-table thead > tr > td.sorting {
      padding-right: 30px;
    }`,
    `table.ng2-ya-table thead .sorting,
    table.ng2-ya-table thead .sorting_asc,
    table.ng2-ya-table thead .sorting_desc,
    table.ng2-ya-table thead .sorting_asc_disabled,
    table.ng2-ya-table thead .sorting_desc_disabled {
      cursor: pointer;
      position: relative;
    }`,
    `table.ng2-ya-table thead .sorting:after,
    table.ng2-ya-table thead .sorting_asc:after,
    table.ng2-ya-table thead .sorting_desc:after,
    table.ng2-ya-table thead .sorting_asc_disabled:after,
    table.ng2-ya-table thead .sorting_desc_disabled:after {
      position: absolute;
      bottom: 12px;
      right: 8px;
      display: block;
      opacity: 0.5;
    }`,
    `table.ng2-ya-table thead .sorting_asc:after {
      content: "↑";
    }`,
    `table.ng2-ya-table thead .sorting_desc:after {
      content: "↓";
    }`,
    `table.ng2-ya-table thead .sorting_asc_disabled:after,
    table.ng2-ya-table thead .sorting_desc_disabled:after {
      color: #eee;
    }`],
  providers: [Ng2YaTableService]
})
export class Ng2YaTableComponent implements OnChanges, OnDestroy, OnInit {
  private subscription : Subscription;
  private fullTextFilterValueChanged: Subject<string> = new Subject<string>();

  processing:boolean = false;
  @Input() options: TableOptions = null;
  @Input() rows:Array<any> | TableDataSource = [];
  @Input() datasource: TableDataSource | Array<any> = null;
  @Input() columns: Array<TableColumn> = [];
  @Input() paging: TablePaging = null;
  @ContentChildren(Ng2YaTableCellTemplateDirective) cellTemplates: QueryList<Ng2YaTableCellTemplateDirective>;

  public constructor(private sanitizer:DomSanitizer, public state: Ng2YaTableService) { 
    this.fullTextFilterValueChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => this.onChangeTable());
  }

  ngOnInit() {
    this.subscription = this.state.stateChanged$.subscribe(() => this.onChangeTable());
  }

  ngOnChanges (changes: SimpleChanges) : void {
    if (changes.options && changes.options.isFirstChange()) {
      this.state.setOptions(changes.options.currentValue);
    }
    if (changes.paging && changes.paging.isFirstChange()) {
      this.state.setPaging(changes.paging.currentValue);
    }
    if (changes.columns && changes.columns.isFirstChange()) {
      this.state.setColumns(changes.columns.currentValue);
    }
    if(changes.datasource && !changes.datasource.isFirstChange()){
      this.onChangeTable();
    }
  }

  ngOnDestroy () : void {
    this.subscription.unsubscribe();
  }

  public sanitize(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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

  public getHtml(row:any, column:TableColumn): string {
    if(column.render){
      let data: any = this.getData(row, column.name);
      return column.render(data, row);
    }
    return this.getData(row, column.name);
  }

  public getData(row:any, propertyName:string):string {
    return propertyName.split('.').reduce((prev:any, curr:string) => prev[curr], row);
  }

  public cellClick(row:any, column:TableColumn):void {
    if(column.action){
      let data = this.getData(row, column.name);
      column.action(data, row);
    }
  }

  onFullTextFilterValueChange(event: any){
    this.fullTextFilterValueChanged.next(event)
  }

  getCellTemplate(col: TableColumn, standardTemplate: TemplateRef<any>): TemplateRef<any> {
    let template = this.cellTemplates.filter(p => p.ng2YaTableCellTemplate === col.name);
    if (template.length > 0) {
      return template.map(p => p.templateRef)[0];
    }
    return standardTemplate;
  }
}
