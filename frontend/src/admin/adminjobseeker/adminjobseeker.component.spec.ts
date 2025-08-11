import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminjobseekerComponent } from './adminjobseeker.component';

describe('AdminjobseekerComponent', () => {
  let component: AdminjobseekerComponent;
  let fixture: ComponentFixture<AdminjobseekerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminjobseekerComponent]
    });
    fixture = TestBed.createComponent(AdminjobseekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
