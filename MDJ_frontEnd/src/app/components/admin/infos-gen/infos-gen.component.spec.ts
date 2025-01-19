import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosGenComponent } from './infos-gen.component';

describe('InfosGenComponent', () => {
  let component: InfosGenComponent;
  let fixture: ComponentFixture<InfosGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosGenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfosGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
