import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminjobkeeperComponent } from './adminjobkeeper.component';

describe('AdminjobkeeperComponent', () => {
  let component: AdminjobkeeperComponent;
  let fixture: ComponentFixture<AdminjobkeeperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminjobkeeperComponent]
    });
    fixture = TestBed.createComponent(AdminjobkeeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
