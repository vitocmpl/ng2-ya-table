import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { Ng2YaTableFilteringDefaultComponent } from './ng2-ya-table-filtering-default.component';
import { Ng2YaTableFilteringListComponent } from './ng2-ya-table-filtering-list.component';
import { Ng2YaTableSortingDirective } from './ng2-ya-table-sorting.directive';
import { Ng2YaTableComponent } from './ng2-ya-table.component';
import { Ng2YaTableCellTemplateDirective } from './ng2-ya-table-cell-template.directive';

@NgModule({
  declarations: [
    Ng2YaTableComponent,
    Ng2YaTableFilteringDefaultComponent,
    Ng2YaTableFilteringListComponent,
    Ng2YaTableSortingDirective,
    Ng2YaTableCellTemplateDirective
  ],
  imports: [CommonModule, ReactiveFormsModule, PaginationModule],
  exports: [Ng2YaTableComponent, Ng2YaTableCellTemplateDirective]
})
export class Ng2YaTableModule {}
