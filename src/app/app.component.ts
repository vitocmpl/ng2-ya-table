import { Component } from '@angular/core';
import { DataSourceService, UserDto } from './data-source.service';
import { Observable } from 'rxjs';
import {
  DatasourceParameters,
  DatasourceResult,
  TableColumn,
  TableColumnFilterListItem,
  TableDataSource,
  TableOptions,
  TablePaging
} from 'ng2-ya-table';
import { faEdit, faHome, faTrash } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataSourceService]
})
export class AppComponent {
  faHome = faHome;
  faTrash = faTrash;
  faEdit = faEdit;

  options: TableOptions = {
    orderMulti: true,
    className: ['table-striped'],
    language: 'en',
    search: true
  };

  datasource: TableDataSource = (
    request: DatasourceParameters
  ): Observable<DatasourceResult<UserDto>> => {
    return this.service.getUsersDataSource(request);
  };

  paging: TablePaging = {
    itemsPerPage: 10,
    itemsPerPageOptions: [5, 10, 25, 50, 100],
    maxSize: 5,
    showPaging: true
  };

  columns: TableColumn[] = [
    {
      title: 'Name',
      name: 'name',
      sort: true,
      sortOrder: 'asc',
      filter: {
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
        controlType: 'default',
        config: {
          placeholder: 'Filter by email'
        }
      }
    },
    {
      title: 'City',
      name: 'address.city',
      sort: true,
      filter: {
        controlType: 'list',
        config: {
          list: this.service.getCities().pipe(
            map((result) => {
              return result.map((c) => {
                const item: TableColumnFilterListItem = {
                  value: c,
                  text: c
                };
                return item;
              });
            })
          )
        }
      }
    },
    {
      sort: false,
      title: '',
      template: 'btnEdit',
      width: '3rem'
    },
    {
      sort: false,
      title: '',
      template: 'btnDelete',
      width: '3rem'
    }
  ];

  constructor(private service: DataSourceService) {}

  onActionClick(row: number): void {
    alert('Id: ' + row);
  }
}
