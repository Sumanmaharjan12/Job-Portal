import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobdetailComponent } from './jobdetail.component';

describe('JobdetailComponent', () => {
  let component: JobdetailComponent;
  let fixture: ComponentFixture<JobdetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobdetailComponent]
    });
    fixture = TestBed.createComponent(JobdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
