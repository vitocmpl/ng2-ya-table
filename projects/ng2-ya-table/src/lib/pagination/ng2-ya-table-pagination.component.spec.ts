import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2YaTablePaginationComponent } from './ng2-ya-table-pagination.component';

describe('PaginationComponent', () => {
  let component: Ng2YaTablePaginationComponent;
  let fixture: ComponentFixture<Ng2YaTablePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [Ng2YaTablePaginationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2YaTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
