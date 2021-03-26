import { Component } from '@angular/core';
import { DataSourceService } from './data-source.service';
import { Observable } from 'rxjs';
import { DatasourceParameters, DatasourceResult, TableColumn, TableDataSource, TableOptions, TablePaging } from 'ng2-ya-table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ DataSourceService ]
})
export class AppComponent {
  constructor(private service: DataSourceService) { }

  public options: TableOptions = {
      orderMulti: false,
      className: ['table-striped'],
      language: "en",
      search: true
  };

  public datasource: TableDataSource = (request: DatasourceParameters): Observable<DatasourceResult> => {
    return this.service.getUsersDataSource(request);
  }

  public paging: TablePaging = {
      itemsPerPage: 10,
      itemsPerPageOptions: [5, 10, 25, 50, 100],
      maxSize: 5,
      showPaging: true
  }

  public columns: TableColumn[] = [
    { 
        title: 'Name', 
        name: 'name', 
        sort: true, 
        defaultSortOrder: 'asc',  
        filter: {
            type: 'default', 
            controlType: 'default',
            config: {
                placeholder: 'Filter by name'
            }
        } 
    },
    { 
        title: 'Username', 
        name: 'username', 
        sort: true, 
        filter: {
            type: 'default', 
            controlType: 'default',
            config: {
                placeholder: 'Filter by username'
            }
        } 
    },
    { 
        title: 'Email', 
        name: 'email', 
        sort: true, 
        filter: {
            type: 'default', 
            controlType: 'default',
            config: {
                placeholder: 'Filter by email'
            }
        } 
    },
    { 
        sort: false, 
        title: '', 
        name: 'btnEdit',
        width: "10px"
    },
    { 
        sort: false, 
        title: '', 
        name: 'btnDelete',
        width: "10px"
    }
  ];

  onActionClick(row: number) {
    alert("Id: " + row);
  }
}
