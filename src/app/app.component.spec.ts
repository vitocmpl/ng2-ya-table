import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { DataSourceService } from './data-source.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    const dataSourceServiceStub: Partial<DataSourceService> = {
      getCities: jest.fn().mockReturnValue(of(null))
    };

    TestBed.overrideComponent(
      AppComponent,
      {
        set: {
          providers: [{
            provide: DataSourceService,
            useValue: dataSourceServiceStub
          }]
        }
      }
    );

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();;

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ng2-ya-table create', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const table = compiled.querySelector('ng2-ya-table');
    expect(table).toBeTruthy();
  });
});
