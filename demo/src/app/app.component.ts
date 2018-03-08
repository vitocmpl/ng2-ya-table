import { Component } from '@angular/core';
import { DemoClient, DataSourceRequest, DataSourceResultOfUser, User } from "../../api/api.module";
import { DataSourceService } from './data-source.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private client: DemoClient, private service: DataSourceService) { }

  public options:any = {
      orderMulti: false,
      className: ['table-striped'],
      language: "en",
      search: true
  };

  public datasource: any = (request: DataSourceRequest): Observable<DataSourceResultOfUser> => {
    if(environment.apiBaseUrl){
        return this.client.get(DataSourceRequest.fromJS(request));
    }
    return this.service.getUsersDataSource(request);
  }

  public paging: any = {
      itemsPerPage: 10,
      itemsPerPageOptions: [5, 10, 25, 50, 100],
      maxSize: 5,
      showPaging: true
  }

  public columns:Array<any> = [
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
        render: (data: any, row: User): string => {
            return "<div class='text-center'>" +
                "<button type='button' class='btn btn-sm btn-primary'><span class='glyphicon glyphicon-pencil'></span></button> " +
                "</div>";
        },
        action: (data: any, row: User): any => {
          alert("Id: " + row.id);
        },
        width: "10px"
    },
    { 
        sort: false, 
        title: '', 
        name: 'btnDelete',
        render: (data: any, row: User): string => {
            return "<div class='text-center'>" +
                "<button type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button> " +
                "</div>";
        },
        action: (data: any, row: User): any => {
          alert("Id: " + row.id);
        },
        width: "10px"
    }
  ];
}
