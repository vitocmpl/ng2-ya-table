import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  LanguageMap,
  TableColumn,
  TableDataSource,
  TableOptions,
  TablePaging
} from './ng2-ya-table-interfaces';
import { Languages } from './ng2-ya-table-languages';
import { Ng2YaTableService } from './services/ng2-ya-table.service';
import { Ng2YaTableCellTemplateDirective } from './directives/ng2-ya-table-cell-template.directive';
import { PageChangedEvent } from './pagination/ng2-ya-table-pagination.component';

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
  private _paging: TablePaging = {
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 25, 50],
    maxSize: 5,
    showPaging: true
  };

  fullTextFilter = new FormControl('');

  language: LanguageMap = null;
  showFilterRow = false;
  processing = false;
  rows = [];
  currentPage = 1;
  itemsPerPage = 10;
  recordsFiltered = 0;
  recordsTotal = 0;

  @Input() options: TableOptions = {
    language: 'en',
    search: true
  };

  @Input() set paging(value: TablePaging) {
    this._paging = value;
    this.itemsPerPage = value.itemsPerPage;
    this.service.setPaging(value.itemsPerPage);
  }
  get paging(): TablePaging {
    return this._paging;
  }

  @Input() set datasource(value: TableDataSource | unknown[]) {
    this.service.setDataSource(value);
  }

  @Input() set columns(value: TableColumn[]) {
    this.showFilterRow = value.some((c) => !!c.filter);
    this.service.setColumns(value);
  }
  get cols(): TableColumn[] {
    return this.service.columns;
  }

  @ContentChildren(Ng2YaTableCellTemplateDirective)
  cellTemplates: QueryList<Ng2YaTableCellTemplateDirective>;

  public constructor(
    private service: Ng2YaTableService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.language =
      typeof this.options?.language === 'string'
        ? Languages[this.options?.language]
        : this.options?.language;
    if (!this.language) {
      this.language = Languages['en'];
    }

    this.subscription.add(
      this.fullTextFilter.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((filterValue) => {
          this.currentPage = 1;
          this.service.request({
            fullTextFilter: filterValue,
            start: 0
          });
        })
    );

    this.subscription.add(
      this.service.result$.subscribe((result) => {
        this.cdRef.markForCheck();
        this.rows = result.data;
        this.recordsFiltered = result.recordsFiltered;
        this.recordsTotal = result.recordsTotal;
      })
    );

    this.subscription.add(
      this.service.processing$.subscribe((result) => {
        this.cdRef.markForCheck();
        this.processing = result;
      })
    );

    this.service.request({});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    this.itemsPerPage = event.itemsPerPage;
    this.service.request({
      start: (event.page - 1) * event.itemsPerPage,
      length: event.itemsPerPage
    });
  }

  onToggleSort(col: TableColumn, shiftKey: boolean) {
    this.service.toggleSort(col, shiftKey && this.options.orderMulti);
  }

  onChangeFilter(col: TableColumn, filterValue: unknown) {
    this.service.changeFilter(col, filterValue);
  }

  getData(row: unknown, propertyName: string): string {
    if (propertyName) {
      return propertyName
        .split('.')
        .reduce((prev: unknown, curr: string) => prev[curr], row);
    }
  }

  getCellTemplate(
    col: TableColumn,
    standardTemplate: TemplateRef<HTMLElement>
  ): TemplateRef<HTMLElement> {
    if (!!col.template || !!col.name) {
      const templates = this.cellTemplates.filter(
        (p) =>
          p.ng2YaTableCellTemplate === (col.template ? col.template : col.name)
      );
      if (templates.length > 0) {
        return templates.map((p) => p.templateRef)[0];
      }
    }
    return standardTemplate;
  }

  getPaginationResult() {
    return this.service.interpolateLocalization(this.language.info as string, {
      start: (this.currentPage - 1) * this.itemsPerPage + 1,
      end: (this.currentPage - 1) * this.itemsPerPage + this.rows.length,
      total: this.recordsFiltered
    });
  }

  refresh() {
    this.service.request({});
  }
}
