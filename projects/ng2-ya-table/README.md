# ng2-ya-table

Angular yet another table with pagination, ordering, filtering and datasource server-side ready.


### Demo

<a target="_blank" href="https://vitocmpl.github.io/ng2-ya-table/">Live Demo</a>

![alt tag](https://github.com/vitocmpl/ng2-ya-table/blob/master/src/assets/img/demo.gif)


## Installation

 - `angular-cli` please refer to [getting-started-with-ng-cli](https://github.com/vitocmpl/ng2-ya-table/tree/master/docs/getting-started/ng-cli.md)
 - ...


## Minimal Setup Example

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Ng2YaTableModule } from 'ng2-ya-table';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2YaTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```xml
<!-- You can now use the library in app.component.html -->
<h1>
  {{title}}
</h1>
<ng2-ya-table [options]="options" [columns]="columns" [datasource]="data" [paging]="paging">
    <ng-template ng2YaTableCellTemplate="btnEdit" let-data='data' let-row='row'>
      <div class='text-center'>
        <button type='button' class='btn btn-sm btn-primary' (click)="onActionClick(row.id)">Edit</button>
      </div>
    </ng-template>
    <ng-template ng2YaTableCellTemplate="btnDelete" let-data='data' let-row='row'>
      <div class='text-center'>
        <button type='button' class='btn btn-sm btn-danger' (click)="onActionClick(row.id)">Delete</button>
      </div>
    </ng-template>
</ng2-ya-table>
```

```typescript
public options: TableOptions = {
    orderMulti: false,
    className: ['table-striped'],
    language: "en"
};

public data: any[] = [...]; //array of data

public paging: TablePaging = {
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 25, 50, 100],
    maxSize: 5
}

public columns: TableColumn[] = [
{ 
    title: 'Name', 
    name: 'name', 
    sort: true, 
    sortOrder: 'asc',  
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
}];
```


## Server-Side datasource Setup Example

```xml
<ng2-ya-table [options]="options" [columns]="columns" [datasource]="datasource" [paging]="paging">
</ng2-ya-table>
```

```typescript
public datasource: any = (request: DatasourceParameters): Observable<DatasourceResult> => {
    return this.service.getUsers(request);
}
```


## Server-Side plugin

.NET Standard library datasource utils [ng2-ya-table.DataSource.Core](https://github.com/vitocmpl/ng2-ya-table.DataSource.Core).


## Further Documentation

Installation, customization and other useful articles will be available soon...


## Features
* Observable data source (client-side or server-side)
* Filtering
* Sorting
* Pagination
* Bootstrap 4 / 5 layout


## License

[MIT](LICENSE) license.
