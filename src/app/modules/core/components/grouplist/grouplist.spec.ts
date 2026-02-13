import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grouplist } from './grouplist';

describe('Grouplist', () => {
  let component: Grouplist;
  let fixture: ComponentFixture<Grouplist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grouplist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grouplist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
