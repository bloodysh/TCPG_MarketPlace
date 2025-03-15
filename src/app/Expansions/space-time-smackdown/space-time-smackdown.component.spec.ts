import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceTimeSmackdownComponent } from './space-time-smackdown.component';

describe('SpaceTimeSmackdownComponent', () => {
  let component: SpaceTimeSmackdownComponent;
  let fixture: ComponentFixture<SpaceTimeSmackdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceTimeSmackdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceTimeSmackdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
