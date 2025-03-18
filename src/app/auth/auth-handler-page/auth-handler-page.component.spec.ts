import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHandlerPageComponent } from './auth-handler-page.component';

describe('AuthHandlerPageComponent', () => {
  let component: AuthHandlerPageComponent;
  let fixture: ComponentFixture<AuthHandlerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHandlerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthHandlerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
