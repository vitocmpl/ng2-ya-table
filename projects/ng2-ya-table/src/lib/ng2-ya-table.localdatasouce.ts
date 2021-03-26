import { Observable, of } from 'rxjs';
import { DatasourceParameters, DatasourceFilter } from './ng2-ya-table-interfaces';

export class Ng2YaTableLocalDataSource {
    private data: Array<any> = [];

    constructor(data: Array<any> = []) {
        this.data = data;
    }

    private defaultTextFilter = (value: string, search: string) => {
        return value.toString().toLowerCase().includes(search.toString().toLowerCase());
    };

    asObservable(request: DatasourceParameters): Observable<any> {
        let filteredData = this.data;
        let defaultFilterColumns: DatasourceFilter[] = request.filters.filter(p => p.type==='default' || p.type ==='text');
        let page = (request.start / request.length) + 1;

        if(request.fullTextFilter && defaultFilterColumns.length > 0) {
            filteredData = filteredData.filter((item) => {
                let rowResult = false;
                defaultFilterColumns.forEach((column) => {
                    let value = typeof item[column.name] === 'undefined' || item[column.name] === null ? '' : item[column.name];
                    let result = this.defaultTextFilter.call(null, value, request.fullTextFilter);
                    if(result === true){
                        rowResult =  true;
                    }
                });
                return rowResult;
            });
        }
        
        defaultFilterColumns.forEach((column) => {
            if(column.value) {
                filteredData = filteredData.filter((el) => {
                    const value = typeof el[column.name] === 'undefined' || el[column.name] === null ? '' : el[column.name];
                    return this.defaultTextFilter.call(null, value, column.value);
                });
            }
        });
        
        request.orders.forEach((column) => {
            const dir: number = (column.dir === 'asc') ? 1 : -1;
    
            const compare: Function = (direction: any, a: any, b: any) => {
                if (a < b) {
                    return -1 * direction;
                }
                if (a > b) {
                    return direction;
                }
                return 0;
            };
            
            filteredData = filteredData.sort((a, b) => {
                return compare.call(null, dir, a[column.name], b[column.name]);
            });
        });
            
    
        return of({
            recordsTotal: this.data.length,
            recordsFiltered: filteredData.length,
            data: filteredData.slice(request.length * (page - 1), request.length * page)
        });
    }
}