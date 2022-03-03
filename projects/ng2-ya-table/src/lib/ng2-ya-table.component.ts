import { Component, Input, OnInit, OnDestroy, ContentChildren, QueryList, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';

import { TableDataSource, TableOptions, TableColumn, TablePaging, LanguageMap } from './ng2-ya-table-interfaces';
import { ColumnState, Ng2YaTableService } from './ng2-ya-table.service';
import { Ng2YaTableCellTemplateDirective } from './ng2-ya-table-cell-template.directive';
import { Languages } from './ng2-ya-table-languages';

@Component({
  selector: 'ng2-ya-table',
  templateUrl: './ng2-ya-table.component.html',
  styleUrls: ['./ng2-ya-table.component.scss'],
  providers: [ Ng2YaTableService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class Ng2YaTableComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();

  itemsPerPage= new FormControl(0);
  fullTextFilter = new FormControl('');
  
  language: LanguageMap = null;
  showFilterRow = false;
  processing = false;
  rows = [];
  currentPage = 1;
  recordsFiltered = 0;
  recordsTotal = 0;

  @Input() options: TableOptions = {};
  @Input() paging: TablePaging = {
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 25, 50],
    maxSize: 5,
    showPaging: true
  };

  @Input() set datasource(value: TableDataSource | any[]) {
    this.service.setDataSource(value);
  }
  
  @Input() set columns(value: TableColumn[]) {
    this.showFilterRow = value.some(c => !!c.filter);
    this.service.setColumns(value);
  }
  get cols(): ColumnState[] {
    return this.service.columns;
  }

  @ViewChild(PaginationComponent) pagination: PaginationComponent;
  @ContentChildren(Ng2YaTableCellTemplateDirective) cellTemplates: QueryList<Ng2YaTableCellTemplateDirective>;

  public constructor(private service: Ng2YaTableService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.language = typeof this.options?.language ==="string" ? Languages[this.options?.language] : this.options?.language;
    if(!this.language) {
      this.language = Languages["en"];
    }

    this.subscription.add(this.fullTextFilter.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => { 
      this.service.request({ 
        fullTextFilter: filterValue,
        start: 0
      });
    }));

    this.itemsPerPage.setValue(this.paging.itemsPerPage, { emitEvent: false });
    this.subscription.add(this.itemsPerPage.valueChanges.subscribe(itemsPerPage => {
      const page = this.pagination.page;
      this.pagination.itemsPerPage = itemsPerPage;
      if(page === this.pagination.page) {
        this.service.request({ 
          start: (page - 1) * itemsPerPage,
          length: itemsPerPage
        });
      }
    }));

    this.subscription.add(this.service.result$.subscribe(result => {
      this.cdRef.markForCheck(); 
      this.rows = result.data;
      this.recordsFiltered = result.recordsFiltered;
      this.recordsTotal = result.recordsTotal;
    }));

    this.subscription.add(this.service.processing$.subscribe(result => {
      this.cdRef.markForCheck(); 
      this.processing = result;
    }));

    this.service.request({});
  }

  ngOnDestroy () : void {
    this.subscription.unsubscribe();
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    this.service.request({ 
      start: (event.page - 1) * event.itemsPerPage,
      length: event.itemsPerPage
    });
  }

  onToggleSort(col: ColumnState, shiftKey: true) {
    this.service.toggleSort(col, shiftKey && this.options.orderMulti);
  }

  onChangeFilter(col: ColumnState, filterValue: any) {
    this.service.changeFilter(col, filterValue);
  }

  getData(row: any, propertyName: string): string {
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
    return this.service.interpolateLocalization(this.language.info as string, {
      start: (this.currentPage - 1) * this.itemsPerPage.value + 1,
      end: (this.currentPage - 1) * this.itemsPerPage.value + this.rows.length,
      total: this.recordsFiltered
    });
  }
}
