import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeZonesComponent } from './liste-zones.component';

describe('ListeZonesComponent', () => {
  let component: ListeZonesComponent;
  let fixture: ComponentFixture<ListeZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeZonesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
