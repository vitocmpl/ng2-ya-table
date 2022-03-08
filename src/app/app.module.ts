import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2YaTableModule } from 'ng2-ya-table';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    Ng2YaTableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
