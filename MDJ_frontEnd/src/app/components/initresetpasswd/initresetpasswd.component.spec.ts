import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitresetpasswdComponent } from './initresetpasswd.component';

describe('InitresetpasswdComponent', () => {
  let component: InitresetpasswdComponent;
  let fixture: ComponentFixture<InitresetpasswdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitresetpasswdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitresetpasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
