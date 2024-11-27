import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCrudComponent } from './instructor-crud.component';

describe('InstructorCrudComponent', () => {
  let component: InstructorCrudComponent;
  let fixture: ComponentFixture<InstructorCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
