import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementFailedComponent } from './paiement-failed.component';

describe('PaiementFailedComponent', () => {
  let component: PaiementFailedComponent;
  let fixture: ComponentFixture<PaiementFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementFailedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
