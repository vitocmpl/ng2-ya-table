import { Observable } from "rxjs";

export type SORT_ORDER = 'asc' | 'desc';
export type FILTER_TYPE = 'default' | 'text' | 'range' | 'daterange' | 'equals' | 'collection';
export type FILTER_CONTROL_TYPE = 'default' | 'list';

export interface TableOptions {
    language?: string | any;
    orderMulti?: boolean;
    className?: string;
    search?: boolean;
}

export interface TablePaging {
    itemsPerPageOptions: number[];
    itemsPerPage: number;
    maxSize:number;
    showPaging: boolean;
}

export interface TableDataSource {
    (request: DatasourceParameters): Observable<DatasourceResult>;
}

export interface TableColumn {
    name : string;
    title? : string;
    width? : number;
    sort?: boolean;
    defaultSortOrder?: SORT_ORDER;
    filter?: TableColumnFilter;
    render?: TableColumnRender;
    action?: TableColumnAction;
}

export interface TableColumnFilter {
    type: FILTER_TYPE;
    controlType: FILTER_CONTROL_TYPE;
    config?: TableColumnFilterDefault;
    configList?: TableColumnFilterList;
}

export interface TableColumnFilterDefault {
    placeholder?: string;
    type?:string;
    max?: number | Date;
    min?: number | Date;
    step?: number;
}

export interface TableColumnFilterList {
    nullText?:string;
    list: any[];
}

export interface TableColumnRender {
    (value: any, row: Object): string;
}

export interface TableColumnAction {
    (value: any, row: Object): void;
}

export interface DatasourceParameters { 
    start: number; 
    length: number; 
    orders: DatasourceOrder[];
    filters: DatasourceFilter[]; 
    fullTextFilter: string;
}

export interface DatasourceFilter { 
    name: string; 
    type: FILTER_TYPE;
    value: any;
}

export interface DatasourceOrder { 
    name: string; 
    dir: SORT_ORDER;
}

export interface DatasourceResult { 
    recordsTotal: number; 
    recordsFiltered: number; 
    data: any[];
}