import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaEntrenamientosComponent } from './area-entrenamientos.component';

describe('AreaEntrenamientosComponent', () => {
  let component: AreaEntrenamientosComponent;
  let fixture: ComponentFixture<AreaEntrenamientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaEntrenamientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaEntrenamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
