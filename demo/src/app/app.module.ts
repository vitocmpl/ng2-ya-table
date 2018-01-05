import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2YaTableModule } from '../../../src';

import { environment } from '../environments/environment';
import { API_BASE_URL, DemoClient } from "../../api/api.module";
import { AppComponent } from './app.component';
import { DataSourceService } from './data-source.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2YaTableModule.forRoot()
  ],
  providers: [
    DemoClient,
    {provide: API_BASE_URL, useValue: environment.apiBaseUrl},
    DataSourceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
