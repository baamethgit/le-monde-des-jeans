import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailCommandeComponent } from './admin-detail-commande.component';

describe('AdminDetailCommandeComponent', () => {
  let component: AdminDetailCommandeComponent;
  let fixture: ComponentFixture<AdminDetailCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailCommandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDetailCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
