import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { DatasourceParameters, DatasourceResult } from "ng2-ya-table";
import { DataSourceService, UserDto } from "./data-source.service";

describe('DataSourceService', () => {
    let service: DataSourceService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let users: UserDto[];
    let request: DatasourceParameters;
    let result: DatasourceResult<UserDto>;
    
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [ DataSourceService ],
            imports: [ HttpClientTestingModule ] 
        });
        service = TestBed.inject(DataSourceService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        
        users = [{
            id: 1,
            name: "Naruto Uzumaki",
            username: "uzumaki.naruto",
            email: "uzumaki.naruto@hokage.com",
            address: { 
                city: "Konohagakure"
            }
        }, {
            id: 2,
            name: "Gaara",
            username: "gaara",
            email: "gaara@kazekage.com",
            address: { 
                city: "Sunagakure"
            }
        }];

        request = {
            start: 0,
            length: 10,
            filters: [],
            orders: [],
            fullTextFilter: ''
        };

        result = {
            data: users,
            recordsFiltered: 2,
            recordsTotal: 2
        };
    });

    afterEach(() => {
        httpTestingController.verify();
    });
  
    it('#getCities should return values', () => {
        service.getCities().subscribe(r => {
            expect(r).toEqual([ "Konohagakure", "Sunagakure" ]);
        });
        
        const req = httpTestingController.expectOne(service["url"]);
        expect(req.request.method).toEqual('GET');
        req.flush(users);
    });

    it('#getUsersDataSource should return values', () => {
        
        service.getUsersDataSource(request).subscribe(r => {
            expect(r).toEqual(result);
        });
        
        const req = httpTestingController.expectOne(`${service["url"]}?_page=1&_limit=10&`);
        expect(req.request.method).toEqual('GET');
        req.flush(result);
    });

    it('#getUsersDataSource with full text filter should return values', () => {
        
        const filtered: DatasourceResult<UserDto> = {
            data: [users[0]],
            recordsFiltered: 1,
            recordsTotal: 2
        };

        service.getUsersDataSource({ ...request, fullTextFilter: 'Naruto'}).subscribe(r => {
            expect(r).toEqual(filtered);
        });
        
        const req = httpTestingController.expectOne(`${service["url"]}?_page=1&_limit=10&q=Naruto&`);
        expect(req.request.method).toEqual('GET');
        req.flush(filtered);
    });

    it('#getUsersDataSource with filters should return values', () => {
        
        const filtered: DatasourceResult<UserDto> = {
            data: [users[0]],
            recordsFiltered: 1,
            recordsTotal: 2
        };

        service.getUsersDataSource({ ...request, filters : [
            { name: 'username', value: 'uzumaki', type: 'default' },
            { name: 'city', value: 'gakure', type: 'default' }
        ]}).subscribe(r => {
            expect(r).toEqual(filtered);
        });
        
        const req = httpTestingController.expectOne(`${service["url"]}?_page=1&_limit=10&username_like=uzumaki&city_like=gakure&`);
        expect(req.request.method).toEqual('GET');
        req.flush(filtered);
    });

    it('#getUsersDataSource with orders should return values', () => {
        
        const filtered: DatasourceResult<UserDto> = {
            data: [ users[1], users[0]],
            recordsFiltered: 2,
            recordsTotal: 2
        };

        service.getUsersDataSource({ ...request, orders : [
            { name: 'username', dir: 'asc' },
            { name: 'city', dir: 'desc' }
        ]}).subscribe(r => {
            expect(r).toEqual(filtered);
        });
        
        const req = httpTestingController.expectOne(`${service["url"]}?_page=1&_limit=10&_sort=username,city&_order=ASC,DESC&`);
        expect(req.request.method).toEqual('GET');
        req.flush(filtered);
    });

    it('#getUsersDataSource should not return values', () => {
        
        const filtered: DatasourceResult<UserDto> = {
            data: [],
            recordsFiltered: 0,
            recordsTotal: 2
        };

        service.getUsersDataSource({ ...request, start: 10 }).subscribe(r => {
            expect(r).toEqual(filtered);
        });
        
        const req = httpTestingController.expectOne(`${service["url"]}?_page=2&_limit=10&`);
        expect(req.request.method).toEqual('GET');
        req.flush(filtered);
    });
  });