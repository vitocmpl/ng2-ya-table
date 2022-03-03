import { fakeAsync, flush } from "@angular/core/testing";
import { of } from "rxjs";
import { DatasourceResult, TableColumn } from "./ng2-ya-table-interfaces";
import { ColumnState, Ng2YaTableService } from "./ng2-ya-table.service";

describe('Ng2YaTableService', () => {
    let service: Ng2YaTableService;
    let users: unknown[];
    let columns: TableColumn[];
    let colsState: ColumnState[];
    
    beforeEach(() => {
        users = [{
            id: 1,
            name: "Naruto Uzumaki",
            address: { 
                city: "Konohagakure"
            }
        }, {
            id: 2,
            name: "Gaara",
            address: { 
                city: "Sunagakure"
            }
        }];

        columns = [{ 
            name: 'name',
            sort: true,
            title: 'Name',
            width: '10rem',
            sortOrder: 'asc',
            filter: {
                controlType: 'default'
            }
        }, { 
            name: 'address.city',
            sort: true,
            title: 'City',
            width: '10rem'
        }];

        colsState = [{
            def: columns[0],
            filterValue: null,
            sortOrder: columns[0].sortOrder
        }, {
            def: columns[1],
            filterValue: null,
            sortOrder: columns[1].sortOrder
        }];

        service = new Ng2YaTableService();
    });

    it('#setDataSource with array datasource should starts request', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setDataSource(users);
        service.request({});
        
        flush();
        expect(processingCount).toEqual(2);
        expect(result).toEqual({
            data: users,
            recordsFiltered: 2,
            recordsTotal: 2
        });
    }));

    it('#setDataSource with observable should starts request', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setDataSource(users);
        const ds = () => of({
            data: users,
            recordsFiltered: 2,
            recordsTotal: 2
        });
        service.setDataSource(ds);
        
        flush();
        expect(processingCount).toEqual(2);
        expect(result).toEqual({
            data: users,
            recordsFiltered: 2,
            recordsTotal: 2
        });
    }));

    it('#setColumns should fills columns and sortStack', () => {
        
        service.setColumns(columns);

        expect(service.columns).toEqual(colsState);
        expect(service.sortStack).toEqual([colsState[0]]);
    });

    it('#toggleSort should order users by city asc', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setColumns(columns);
        service.setDataSource(users);
        expect(service.sortStack.length).toEqual(1);
        service.toggleSort(service.columns[1], false);
        flush();
        expect(service.columns[1].sortOrder).toEqual('asc');
        expect(service.sortStack.length).toEqual(1);
        expect(processingCount).toEqual(2);
        expect(result).toEqual({
            data: [users[0], users[1]],
            recordsFiltered: 2,
            recordsTotal: 2
        });
    }));

    it('#toggleSort should order users by name and city', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setColumns(columns);
        service.setDataSource(users);
        expect(service.sortStack.length).toEqual(1);
        service.toggleSort(service.columns[1], true);
        flush();
        expect(service.sortStack[0].def.name).toEqual('name');
        expect(service.sortStack[0].sortOrder).toEqual('asc');
        expect(service.sortStack[1].def.name).toEqual('address.city');
        expect(service.columns[1].sortOrder).toEqual('asc');
        expect(service.sortStack.length).toEqual(2);
        expect(processingCount).toEqual(2);
        expect(result).toEqual({
            data: [users[1], users[0]],
            recordsFiltered: 2,
            recordsTotal: 2
        });
    }));

    it('#toggleSort should order users by name desc', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setColumns(columns);
        service.setDataSource(users);
        expect(service.sortStack.length).toEqual(1);
        service.toggleSort(service.columns[0], true);
        flush();
        expect(service.columns[0].sortOrder).toEqual('desc');
        expect(service.sortStack.length).toEqual(1);
        expect(processingCount).toEqual(2);
        expect(result).toEqual({
            data: [users[0], users[1]],
            recordsFiltered: 2,
            recordsTotal: 2
        });
    }));

    it('#toggleSort should reset sort', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setColumns(columns);
        service.setDataSource(users);
        expect(service.sortStack.length).toEqual(1);
        service.toggleSort(service.columns[0], true);
        service.toggleSort(service.columns[0], true);
        flush();
        expect(service.columns[0].sortOrder).toEqual(null);
        expect(service.sortStack.length).toEqual(0);
        expect(processingCount).toEqual(4);
        expect(result).toEqual({
            data: [users[0], users[1]],
            recordsFiltered: 2,
            recordsTotal: 2
        });
    }));

    it('#changeFilter should start request', fakeAsync(() => {
        
        let processingCount = 0;
        let result: DatasourceResult = null;
        service.result$.subscribe(r => result = r);
        service.processing$.subscribe(r => processingCount++);
        service.setColumns(columns);
        service.setDataSource(users);
        service.changeFilter(service.columns[0], 'Gaara');
        flush();
        expect(service.columns[0].filterValue).toEqual('Gaara');
        expect(processingCount).toEqual(2);
        expect(result).toEqual({
            data: [users[1]],
            recordsFiltered: 1,
            recordsTotal: 2
        });
    }));

    it('#interpolateLocalization should return value', () => {
        const label = 'Hello {{name}}!';
        const result = service.interpolateLocalization(label, { name: 'Naruto' });
        expect(result).toEqual('Hello Naruto!');
    });

    it('#interpolateLocalization should not return value', () => {
        const label = 'Hello {{name}}!';
        const result = service.interpolateLocalization(label, {});
        expect(result).toEqual(label);
    });
});