# ng2-ya-table

Angular 4 yet another table with pagination, ordering, filtering and datasource server-side ready.


### Demo

<a target="_blank" href="https://vitocmpl.github.io/ng2-ya-table/">Live Demo</a>

![alt tag](demo/src/assets/img/demo.gif)


## Installation

To install this library, run:

```bash
$ npm install ng2-ya-table --save
```


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
    FormsModule,
    Ng2YaTableModule.forRoot()
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
<ng2-ya-table [options]="options" [columns]="columns" [datasource]="datasource" [paging]="paging">
</ng2-ya-table>
```

```typescript
public options:any = {
    orderMulti: false,
    className: ['table-striped'],
    language: "en"
};

public datasource: any = (request: any): Observable<any> => {
    return this.service.getUsers(request);
}

public paging: any = {
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 25, 50, 100],
    maxSize: 5
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
    }
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
    }
}];
```


## Server-Side plugin

.NET Core datasource utils [ng2-ya-table.DataSource.Core](https://github.com/vitocmpl/ng2-ya-table.DataSource.Core).


## Further Documentation

Installation, customization and other useful articles will be available soon...


## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

To lint all `*.ts` files:

```bash
$ npm run lint
```


## Features
* Observable data source (client-side or server-side)
* Filtering
* Sorting
* Pagination
* Bootstrap 3 layout


## License

[MIT](LICENSE) license.
