import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoAComponent } from './promo-a.component';

describe('PromoAComponent', () => {
  let component: PromoAComponent;
  let fixture: ComponentFixture<PromoAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
