import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface PageChangedEvent {
  itemsPerPage: number;
  page: number;
}

interface Page {
  text: string;
  number: number;
  active: boolean;
}

@Component({
  selector: 'ng2-ya-table-pagination',
  templateUrl: './ng2-ya-table-pagination.component.html',
  styleUrls: ['./ng2-ya-table-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2YaTablePaginationComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private _totalItems = 0;

  itemsPerPageControl = new FormControl(0);
  totalPages = 0;
  pages: Page[];

  @Input() page: number;
  @Input() itemsPerPageOptions: number[];

  @Input() set itemsPerPage(value: number) {
    this.itemsPerPageControl.setValue(value, { emitEvent: false });
    this.totalPages = this.calculateTotalPages();
    this.pages = this.getPages(this.page, this.totalPages);
  }
  get itemsPerPage(): number {
    return this.itemsPerPageControl.value;
  }

  @Input() set totalItems(value: number) {
    this._totalItems = value;
    this.totalPages = this.calculateTotalPages();
    this.pages = this.getPages(this.page, this.totalPages);
  }
  get totalItems(): number {
    return this._totalItems;
  }

  @Input() maxSize: number;
  @Input() nextText: string;
  @Input() previousText: string;

  @Output() paginationChanged = new EventEmitter<PageChangedEvent>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription.add(
      this.itemsPerPageControl.valueChanges.subscribe((itemsPerPage) => {
        this.cdRef.markForCheck();
        this.totalPages = this.calculateTotalPages();
        this.pages = this.getPages(this.page, this.totalPages);
        this.page = Math.min(this.page, this.totalPages);
        this.paginationChanged.emit({
          itemsPerPage: itemsPerPage,
          page: this.page
        });
      })
    );
    this.totalPages = this.calculateTotalPages();
    this.pages = this.getPages(this.page, this.totalPages);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectPage(page: number, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.page = page;
    this.pages = this.getPages(this.page, this.totalPages);

    this.paginationChanged.emit({
      page: page,
      itemsPerPage: this.itemsPerPage
    });
  }

  private calculateTotalPages(): number {
    const totalPages =
      this.itemsPerPage < 1
        ? 1
        : Math.ceil(this.totalItems / this.itemsPerPage);

    return Math.max(totalPages || 0, 1);
  }

  private getPages(currentPage: number, totalPages: number): Page[] {
    const pages: Page[] = [];
    let startPage = 1;
    let endPage = totalPages;
    const isMaxSized = !!this.maxSize && this.maxSize < totalPages;

    if (isMaxSized && this.maxSize) {
      startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
      endPage = startPage + this.maxSize - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - this.maxSize + 1;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      const page = {
        number: num,
        text: num.toString(),
        active: num === currentPage
      };
      pages.push(page);
    }

    if (isMaxSized) {
      if (startPage > 1) {
        const previousPageSet = {
          number: startPage - 1,
          text: '...',
          active: false
        };
        pages.unshift(previousPageSet);
      }

      if (endPage < totalPages) {
        const nextPageSet = {
          number: endPage + 1,
          text: '...',
          active: false
        };
        pages.push(nextPageSet);
      }
    }

    return pages;
  }
}
