import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { Ng2YaTablePaginationComponent } from './ng2-ya-table-pagination.component';

describe('Ng2YaTablePaginationComponent', () => {
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
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('.form-select');
    expect(select).toBeTruthy();
    expect(select.options.length).toEqual(0);
  });

  it('itemsPerPage valueChanges should change pages', () => {
    component.totalItems = 10;
    component.itemsPerPage = 5;
    fixture.detectChanges();

    expect(component.totalPages).toEqual(2);
    expect(component.pages.length).toEqual(2);

    component.itemsPerPageControl.setValue(1);
    fixture.detectChanges();

    expect(component.totalPages).toEqual(10);
    expect(component.pages.length).toEqual(10);
  });

  it('maxSize should change pages', () => {
    component.page = 1;
    component.maxSize = 3;
    component.totalItems = 10;
    component.itemsPerPage = 5;
    fixture.detectChanges();

    expect(component.totalPages).toEqual(2);
    expect(component.pages.length).toEqual(2);

    component.itemsPerPage = 1;
    fixture.detectChanges();

    expect(component.totalPages).toEqual(10);
    expect(component.pages.length).toEqual(4);

    component.page = 8;
    component.itemsPerPage = 1;
    fixture.detectChanges();
    expect(component.pages.length).toEqual(5);

    component.page = 10;
    component.itemsPerPage = 1;
    fixture.detectChanges();
    expect(component.pages.length).toEqual(4);
  });

  it('selectPage should change pages', () => {
    const paginationChangedSpy = jest.spyOn(
      component.paginationChanged,
      'emit'
    );

    component.page = 1;
    component.maxSize = 3;
    component.totalItems = 10;
    component.itemsPerPage = 1;
    fixture.detectChanges();

    expect(component.totalPages).toEqual(10);
    expect(component.pages.length).toEqual(4);

    component.selectPage(5, new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.pages.length).toEqual(5);
    expect(paginationChangedSpy).toHaveBeenCalled();
  });
});
