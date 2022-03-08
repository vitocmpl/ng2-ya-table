import { of } from 'rxjs';
import {
  DatasourceParameters,
  TableDataSource
} from '../ng2-ya-table-interfaces';

export function getItemValues(item: unknown): string {
  return Object.entries(item)
    .map((i) => i[1])
    .reduce((str, val) => {
      return `${str}${
        typeof val === 'object' ? getItemValues(val) : val + ';'
      }`;
    }, '');
}

function defaultTextFilter(value: unknown, search: unknown): boolean {
  return value
    ?.toString()
    .toLowerCase()
    .includes(search?.toString().toLowerCase());
}

function getData(item: unknown, propName: string): string {
  if (propName) {
    return propName
      .split('.')
      .reduce((prev: unknown, curr: string) => prev[curr], item);
  }
}

export class Ng2YaTableLocalDataSource {
  private data: unknown[] = [];

  constructor(data: unknown[]) {
    this.data = data;
  }

  toDataSource(): TableDataSource {
    return (request: DatasourceParameters) => {
      let filteredData = this.data;
      const page = request.start / request.length + 1;

      filteredData = filteredData.filter((item) => {
        return defaultTextFilter(getItemValues(item), request.fullTextFilter);
      });

      request.filters
        .filter((c) => !!c.value)
        .forEach((column) => {
          filteredData = filteredData.filter((item) => {
            const value = getData(item, column.name);
            return defaultTextFilter(value, column.value);
          });
        });

      [...request.orders].reverse().forEach((column) => {
        const dir = column.dir === 'asc' ? 1 : -1;

        const compare = (direction: number, a: unknown, b: unknown) => {
          if (a < b) {
            return -1 * direction;
          }
          if (a > b) {
            return direction;
          }
          return 0;
        };

        filteredData = filteredData.sort((a, b) => {
          return compare(dir, getData(a, column.name), getData(b, column.name));
        });
      });

      return of({
        recordsTotal: this.data.length,
        recordsFiltered: filteredData.length,
        data: filteredData.slice(
          request.length * (page - 1),
          request.length * page
        )
      });
    };
  }
}
