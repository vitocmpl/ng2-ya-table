import { fakeAsync, flush } from '@angular/core/testing';
import {
  DatasourceParameters,
  DatasourceResult,
  TableDataSource
} from '../ng2-ya-table-interfaces';
import {
  Ng2YaTableLocalDataSource,
  getItemValues
} from './ng2-ya-table.localdatasouce';

describe('Ng2YaTableLocalDataSource', () => {
  let service: Ng2YaTableLocalDataSource;
  let datasource: TableDataSource;
  let request: DatasourceParameters;
  let users: unknown[];

  beforeEach(() => {
    users = [
      {
        id: 1,
        name: 'Naruto Uzumaki',
        address: {
          city: 'Konohagakure'
        },
        jinchuriki: 'yes'
      },
      {
        id: 2,
        name: 'Gaara',
        address: {
          city: 'Sunagakure'
        },
        jinchuriki: 'yes'
      }
    ];

    service = new Ng2YaTableLocalDataSource(users);
    datasource = service.toDataSource();

    request = {
      start: 0,
      length: 10,
      filters: [],
      orders: [],
      fullTextFilter: ''
    };
  });

  it('datasource should return values', fakeAsync(() => {
    let result: DatasourceResult = null;
    datasource(request).subscribe((r) => (result = r));
    flush();
    expect(result).toEqual({
      data: users,
      recordsFiltered: 2,
      recordsTotal: 2
    });
  }));

  it('datasource with full text filter should return values', fakeAsync(() => {
    const filtered: DatasourceResult = {
      data: [users[0]],
      recordsFiltered: 1,
      recordsTotal: 2
    };

    expect(getItemValues(users[0])).toEqual(
      '1;Naruto Uzumaki;Konohagakure;yes;'
    );

    let result: DatasourceResult = null;
    datasource({ ...request, fullTextFilter: 'Naruto' }).subscribe(
      (r) => (result = r)
    );
    flush();
    expect(result).toEqual(filtered);
  }));

  it('datasource with full text filter should return two values', fakeAsync(() => {
    const filtered: DatasourceResult = {
      data: users,
      recordsFiltered: 2,
      recordsTotal: 2
    };

    expect(getItemValues(users[1])).toEqual('2;Gaara;Sunagakure;yes;');

    let result: DatasourceResult = null;
    datasource({ ...request, fullTextFilter: 'yes' }).subscribe(
      (r) => (result = r)
    );
    flush();
    expect(result).toEqual(filtered);
  }));

  it('datasource with full text filter should not return values', fakeAsync(() => {
    const filtered: DatasourceResult = {
      data: [],
      recordsFiltered: 0,
      recordsTotal: 2
    };

    let result: DatasourceResult = null;
    datasource({ ...request, fullTextFilter: 'Boruto' }).subscribe(
      (r) => (result = r)
    );
    flush();
    expect(result).toEqual(filtered);
  }));

  it('datasource with filter should return values', fakeAsync(() => {
    const filtered: DatasourceResult = {
      data: [users[0]],
      recordsFiltered: 1,
      recordsTotal: 2
    };

    let result: DatasourceResult = null;
    datasource({
      ...request,
      filters: [
        { name: 'id', value: null },
        { name: 'name', value: 'uzumaki' },
        { name: 'address.city', value: 'gakure' }
      ]
    }).subscribe((r) => (result = r));
    flush();
    expect(result).toEqual(filtered);
  }));

  it('datasource with orders should return values', fakeAsync(() => {
    const filtered: DatasourceResult = {
      data: [users[1], users[0]],
      recordsFiltered: 2,
      recordsTotal: 2
    };

    let result: DatasourceResult = null;
    datasource({
      ...request,
      orders: [
        { name: 'name', dir: 'asc' },
        { name: 'address.city', dir: 'desc' }
      ]
    }).subscribe((r) => (result = r));
    flush();
    expect(result).toEqual(filtered);
  }));

  it('datasource with orders should return other values', fakeAsync(() => {
    const filtered: DatasourceResult = {
      data: [users[0], users[1]],
      recordsFiltered: 2,
      recordsTotal: 2
    };

    let result: DatasourceResult = null;
    datasource({
      ...request,
      orders: [
        { name: 'address.city', dir: 'asc' },
        { name: 'jinchuriki', dir: 'asc' }
      ]
    }).subscribe((r) => (result = r));

    flush();

    expect(result).toEqual(filtered);
  }));
});
