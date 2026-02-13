import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creategroup } from './creategroup';

describe('Creategroup', () => {
  let component: Creategroup;
  let fixture: ComponentFixture<Creategroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creategroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creategroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
