import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAssignListComponent } from './staff-assign-list.component';

describe('StaffAssignListComponent', () => {
  let component: StaffAssignListComponent;
  let fixture: ComponentFixture<StaffAssignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffAssignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
