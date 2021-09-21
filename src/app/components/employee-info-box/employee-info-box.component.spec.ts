import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoBoxComponent } from './employee-info-box.component';

describe('EmployeeInfoBoxComponent', () => {
  let component: EmployeeInfoBoxComponent;
  let fixture: ComponentFixture<EmployeeInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeInfoBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
