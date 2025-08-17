import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobrecommendationComponent } from './jobrecommendation.component';

describe('JobrecommendationComponent', () => {
  let component: JobrecommendationComponent;
  let fixture: ComponentFixture<JobrecommendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobrecommendationComponent]
    });
    fixture = TestBed.createComponent(JobrecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
