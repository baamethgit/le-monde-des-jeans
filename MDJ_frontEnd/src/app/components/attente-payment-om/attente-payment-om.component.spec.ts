import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentePaymentOmComponent } from './attente-payment-om.component';

describe('AttentePaymentOmComponent', () => {
  let component: AttentePaymentOmComponent;
  let fixture: ComponentFixture<AttentePaymentOmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentePaymentOmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttentePaymentOmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
