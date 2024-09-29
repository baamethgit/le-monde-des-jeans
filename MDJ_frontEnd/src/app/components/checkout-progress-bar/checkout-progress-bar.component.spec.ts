import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProgressBarComponent } from './checkout-progress-bar.component';

describe('CheckoutProgressBarComponent', () => {
  let component: CheckoutProgressBarComponent;
  let fixture: ComponentFixture<CheckoutProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutProgressBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
