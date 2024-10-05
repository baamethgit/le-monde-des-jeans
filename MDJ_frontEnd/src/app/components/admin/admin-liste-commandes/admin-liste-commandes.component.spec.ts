import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListeCommandesComponent } from './admin-liste-commandes.component';

describe('AdminListeCommandesComponent', () => {
  let component: AdminListeCommandesComponent;
  let fixture: ComponentFixture<AdminListeCommandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListeCommandesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminListeCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
