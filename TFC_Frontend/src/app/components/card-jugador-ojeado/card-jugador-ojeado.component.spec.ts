import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardJugadorOjeadoComponent } from './card-jugador-ojeado.component';

describe('CardJugadorOjeadoComponent', () => {
  let component: CardJugadorOjeadoComponent;
  let fixture: ComponentFixture<CardJugadorOjeadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardJugadorOjeadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardJugadorOjeadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
