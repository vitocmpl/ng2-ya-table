import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatasourceParameters, DatasourceResult } from 'ng2-ya-table';

export interface UserDto {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
  };
}

@Injectable()
export class DataSourceService {

  private url = "https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) { }

  getUsersDataSource(request: DatasourceParameters): Observable<DatasourceResult<UserDto>> {
    return this.getDataSource(this.url, request);
  }

  getCities(): Observable<string[]> {
    return this.http.get<UserDto[]>(this.url).pipe(
      map(result => {
        const cities = [...new Set(result.map(r => r.address?.city))];
        return cities;
      }
    ));
  }
  
  private getDataSource(url: string, request: DatasourceParameters): Observable<DatasourceResult<UserDto>> {
    const page = request.start > 0 ? (request.start / request.length) + 1 : request.start + 1;
    url += `?_page=${page}&_limit=${request.length}&`;

    request.orders.forEach((order) => {
      url += `_sort=${order.name}&_order=${order.dir.toUpperCase()}&`;
    });

    request.filters.forEach((filter) => {
      if (filter.value) {
        url += `${filter.name}_like=${filter.value}&`;
      }
    });

    if(request.fullTextFilter){
      url += `q=${request.fullTextFilter}&`;
    }

    return this.http.get<UserDto[]>(url, {observe: 'response'}).pipe(
      map(res => {
        const data = res.body;
        const count = +res.headers.get('x-total-count');
        const result: DatasourceResult<UserDto> = {
          recordsTotal: count,
          recordsFiltered: count,
          data: data
        };
        return result;
      })
    );
  }
}
