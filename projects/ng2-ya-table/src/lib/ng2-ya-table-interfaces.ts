import { Observable } from "rxjs";

export type SORT_ORDER = 'asc' | 'desc';
export type FILTER_TYPE = 'default' | 'text' | 'range' | 'daterange' | 'equals' | 'collection';
export type FILTER_CONTROL_TYPE = 'default' | 'list';
export type FILTER_DEFAULT_CONTROL_TYPE = 'text' | 'number' | 'date' | 'time';

export interface TableOptions {
    language?: string | LanguagesMap;
    orderMulti?: boolean;
    className?: string | string[];
    search?: boolean;
}

export interface TablePaging {
    itemsPerPageOptions: number[];
    itemsPerPage: number;
    maxSize: number;
    showPaging: boolean;
}

export interface TableDataSource {
    (request: DatasourceParameters): Observable<DatasourceResult>;
}

export interface TableColumn {
    name?: string;
    title?: string;
    width?: number | string;
    sort?: boolean;
    defaultSortOrder?: SORT_ORDER;
    filter?: TableColumnFilter;
    template?: string;
}

export interface TableColumnFilter {
    type: FILTER_TYPE;
    controlType: FILTER_CONTROL_TYPE;
    config?: TableColumnFilterDefault | TableColumnFilterList;
}

export interface TableColumnFilterDefault {
    placeholder?: string;
    type?: FILTER_DEFAULT_CONTROL_TYPE;
    max?: number | Date;
    min?: number | Date;
    step?: number;
}

export interface TableColumnFilterList {
    nullText?:string;
    list: Observable<TableColumnFilterListItem[]>;
}

export interface TableColumnFilterListItem {
    value: string | number | symbol;
    text: string
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

export interface DatasourceResult<T = any> { 
    recordsTotal: number; 
    recordsFiltered: number; 
    data: T[];
}

export interface LanguageMap {
    [key: string]: string | LanguageMap;
}

export interface LanguagesMap {
    [culture: string]: LanguageMap;
}