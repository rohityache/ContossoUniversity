import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentCrudComponent } from './enrollment-crud.component';

describe('EnrollmentCrudComponent', () => {
  let component: EnrollmentCrudComponent;
  let fixture: ComponentFixture<EnrollmentCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
