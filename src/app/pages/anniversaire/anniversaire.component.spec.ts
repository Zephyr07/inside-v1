import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnniversaireComponent } from './anniversaire.component';

describe('AnniversaireComponent', () => {
  let component: AnniversaireComponent;
  let fixture: ComponentFixture<AnniversaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnniversaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnniversaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
