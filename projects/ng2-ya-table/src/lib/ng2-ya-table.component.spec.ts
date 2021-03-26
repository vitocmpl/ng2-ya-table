import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2YaTableComponent } from './ng2-ya-table.component';

describe('Ng2YaTableComponent', () => {
  let component: Ng2YaTableComponent;
  let fixture: ComponentFixture<Ng2YaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ng2YaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2YaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
