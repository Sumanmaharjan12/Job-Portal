import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostajobComponent } from './postajob.component';

describe('PostajobComponent', () => {
  let component: PostajobComponent;
  let fixture: ComponentFixture<PostajobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostajobComponent]
    });
    fixture = TestBed.createComponent(PostajobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
