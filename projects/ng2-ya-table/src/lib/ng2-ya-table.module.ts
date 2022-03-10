import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2YaTableFilteringDefaultComponent } from './filtering/ng2-ya-table-filtering-default.component';
import { Ng2YaTableFilteringListComponent } from './filtering/ng2-ya-table-filtering-list.component';
import { Ng2YaTableSortingDirective } from './directives/ng2-ya-table-sorting.directive';
import { Ng2YaTableCellTemplateDirective } from './directives/ng2-ya-table-cell-template.directive';
import { Ng2YaTablePaginationComponent } from './pagination/ng2-ya-table-pagination.component';
import { Ng2YaTableComponent } from './ng2-ya-table.component';

@NgModule({
  declarations: [
    Ng2YaTableComponent,
    Ng2YaTableFilteringDefaultComponent,
    Ng2YaTableFilteringListComponent,
    Ng2YaTableSortingDirective,
    Ng2YaTableCellTemplateDirective,
    Ng2YaTablePaginationComponent
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [Ng2YaTableComponent, Ng2YaTableCellTemplateDirective]
})
export class Ng2YaTableModule {}
