import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPanierComponent } from './item-panier.component';

describe('ItemPanierComponent', () => {
  let component: ItemPanierComponent;
  let fixture: ComponentFixture<ItemPanierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPanierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemPanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
