﻿/* tslint:disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v9.11.6282.38816 (NJsonSchema v8.10.6282.29572) (http://NSwag.org)
// </auto-generated>
//----------------------

import 'rxjs/Rx'; 
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

export const API_BASE_URL = new OpaqueToken('API_BASE_URL');

@Injectable()
export class DemoClient {
    private http: Http = null; 
    private baseUrl: string = undefined; 
    protected jsonParseReviver: (key: string, value: any) => any = undefined;

    constructor(@Inject(Http) http: Http, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http; 
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000"; 
    }

    get(parameters: DataSourceRequest): Observable<DataSourceResultOfUser> {
        let url_ = this.baseUrl + "/api/Demo";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(parameters ? parameters.toJS() : null);
        
        let options_ = {
            body: content_,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8", 
                "Accept": "application/json; charset=UTF-8"
            })
        };

        return this.http.request(url_, options_).map((response) => {
            return this.processGet(response);
        }).catch((response: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processGet(response));
                } catch (e) {
                    return <Observable<DataSourceResultOfUser>><any>Observable.throw(e);
                }
            } else
                return <Observable<DataSourceResultOfUser>><any>Observable.throw(response);
        });
    }

    protected processGet(response: Response): DataSourceResultOfUser {
        const responseText = response.text();
        const status = response.status; 

        if (status === 200) {
            let result200: DataSourceResultOfUser = null;
            let resultData200 = responseText === "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result200 = resultData200 ? DataSourceResultOfUser.fromJS(resultData200) : null;
            return result200;
        } else if (status !== 200 && status !== 204) {
            this.throwException("An unexpected server error occurred.", status, responseText);
        }
        return null;
    }

    protected throwException(message: string, status: number, response: string, result?: any): any {
        if(result !== null && result !== undefined)
            throw result;
        else
            throw new SwaggerException(message, status, response, null);
    }
}

export class DataSourceRequest {
    start: number;
    length: number;
    orders: DataSourceRequestOrder[];
    filters: DataSourceRequestFilter[];
    fullTextFilter: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.start = data["start"] !== undefined ? data["start"] : undefined;
            this.length = data["length"] !== undefined ? data["length"] : undefined;
            if (data["orders"] && data["orders"].constructor === Array) {
                this.orders = [];
                for (let item of data["orders"])
                    this.orders.push(DataSourceRequestOrder.fromJS(item));
            }
            if (data["filters"] && data["filters"].constructor === Array) {
                this.filters = [];
                for (let item of data["filters"])
                    this.filters.push(DataSourceRequestFilter.fromJS(item));
            }
            this.fullTextFilter = data["fullTextFilter"] !== undefined ? data["fullTextFilter"] : undefined;
        }
    }

    static fromJS(data: any): DataSourceRequest {
        return new DataSourceRequest(data);
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["start"] = this.start !== undefined ? this.start : undefined;
        data["length"] = this.length !== undefined ? this.length : undefined;
        if (this.orders && this.orders.constructor === Array) {
            data["orders"] = [];
            for (let item of this.orders)
                data["orders"].push(item.toJS());
        }
        if (this.filters && this.filters.constructor === Array) {
            data["filters"] = [];
            for (let item of this.filters)
                data["filters"].push(item.toJS());
        }
        data["fullTextFilter"] = this.fullTextFilter !== undefined ? this.fullTextFilter : undefined;
        return data; 
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }

    clone() {
        const json = this.toJSON();
        return new DataSourceRequest(JSON.parse(json));
    }
}

export class DataSourceRequestOrder {
    name: string;
    dir: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.name = data["name"] !== undefined ? data["name"] : undefined;
            this.dir = data["dir"] !== undefined ? data["dir"] : undefined;
        }
    }

    static fromJS(data: any): DataSourceRequestOrder {
        return new DataSourceRequestOrder(data);
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["name"] = this.name !== undefined ? this.name : undefined;
        data["dir"] = this.dir !== undefined ? this.dir : undefined;
        return data; 
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }

    clone() {
        const json = this.toJSON();
        return new DataSourceRequestOrder(JSON.parse(json));
    }
}

export class DataSourceRequestFilter {
    name: string;
    value: any;
    type: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.name = data["name"] !== undefined ? data["name"] : undefined;
            this.value = data["value"] !== undefined ? data["value"] : undefined;
            this.type = data["type"] !== undefined ? data["type"] : undefined;
        }
    }

    static fromJS(data: any): DataSourceRequestFilter {
        return new DataSourceRequestFilter(data);
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["name"] = this.name !== undefined ? this.name : undefined;
        data["value"] = this.value !== undefined ? this.value : undefined;
        data["type"] = this.type !== undefined ? this.type : undefined;
        return data; 
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }

    clone() {
        const json = this.toJSON();
        return new DataSourceRequestFilter(JSON.parse(json));
    }
}

export class DataSourceResultOfUser {
    recordsTotal: number;
    recordsFiltered: number;
    data: User[];

    constructor(data?: any) {
        if (data !== undefined) {
            this.recordsTotal = data["recordsTotal"] !== undefined ? data["recordsTotal"] : undefined;
            this.recordsFiltered = data["recordsFiltered"] !== undefined ? data["recordsFiltered"] : undefined;
            if (data["data"] && data["data"].constructor === Array) {
                this.data = [];
                for (let item of data["data"])
                    this.data.push(User.fromJS(item));
            }
        }
    }

    static fromJS(data: any): DataSourceResultOfUser {
        return new DataSourceResultOfUser(data);
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["recordsTotal"] = this.recordsTotal !== undefined ? this.recordsTotal : undefined;
        data["recordsFiltered"] = this.recordsFiltered !== undefined ? this.recordsFiltered : undefined;
        if (this.data && this.data.constructor === Array) {
            data["data"] = [];
            for (let item of this.data)
                data["data"].push(item.toJS());
        }
        return data; 
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }

    clone() {
        const json = this.toJSON();
        return new DataSourceResultOfUser(JSON.parse(json));
    }
}

export class User {
    id: number;
    name: string;
    username: string;
    email: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.id = data["id"] !== undefined ? data["id"] : undefined;
            this.name = data["name"] !== undefined ? data["name"] : undefined;
            this.username = data["username"] !== undefined ? data["username"] : undefined;
            this.email = data["email"] !== undefined ? data["email"] : undefined;
        }
    }

    static fromJS(data: any): User {
        return new User(data);
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["id"] = this.id !== undefined ? this.id : undefined;
        data["name"] = this.name !== undefined ? this.name : undefined;
        data["username"] = this.username !== undefined ? this.username : undefined;
        data["email"] = this.email !== undefined ? this.email : undefined;
        return data; 
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }

    clone() {
        const json = this.toJSON();
        return new User(JSON.parse(json));
    }
}

export class SwaggerException extends Error {
    message: string;
    status: number; 
    response: string; 
    result: any; 

    constructor(message: string, status: number, response: string, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.result = result;
    }
}