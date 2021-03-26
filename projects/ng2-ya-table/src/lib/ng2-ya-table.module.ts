import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { Ng2YaTableFilteringDefaultComponent } from './ng2-ya-table-filtering-default.component';
import { Ng2YaTableFilteringListComponent } from './ng2-ya-table-filtering-list.component';
import { Ng2YaTableSortingDirective } from './ng2-ya-table-sorting.directive';
import { Ng2YaTableComponent } from './ng2-ya-table.component';

@NgModule({
  declarations: [ 
    Ng2YaTableComponent,
    Ng2YaTableFilteringDefaultComponent,
    Ng2YaTableFilteringListComponent,
    Ng2YaTableSortingDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule
  ],
  exports: [Ng2YaTableComponent]
})
export class Ng2YaTableModule { }
