import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexGenComponent } from './apex-gen.component';

describe('ApexGenComponent', () => {
  let component: ApexGenComponent;
  let fixture: ComponentFixture<ApexGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApexGenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApexGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
