import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2YaTableModule } from 'ng2-ya-table';

import { environment } from '../environments/environment';
import { API_BASE_URL, DemoClient } from "../../api/api.module";
import { AppComponent } from './app.component';

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
    {provide: API_BASE_URL, useValue: environment.apiBaseUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
