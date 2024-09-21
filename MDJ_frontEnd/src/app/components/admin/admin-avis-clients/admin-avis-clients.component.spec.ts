import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAvisClientsComponent } from './admin-avis-clients.component';

describe('AdminAvisClientsComponent', () => {
  let component: AdminAvisClientsComponent;
  let fixture: ComponentFixture<AdminAvisClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAvisClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAvisClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
