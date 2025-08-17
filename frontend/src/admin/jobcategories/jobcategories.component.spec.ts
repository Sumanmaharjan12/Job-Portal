import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcategoriesComponent } from './jobcategories.component';

describe('JobcategoriesComponent', () => {
  let component: JobcategoriesComponent;
  let fixture: ComponentFixture<JobcategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobcategoriesComponent]
    });
    fixture = TestBed.createComponent(JobcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
