import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MythicalIslandComponent } from './mythical-island.component';

describe('MythicalIslandComponent', () => {
  let component: MythicalIslandComponent;
  let fixture: ComponentFixture<MythicalIslandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MythicalIslandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MythicalIslandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
