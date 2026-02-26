import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdduser } from './group-adduser';

describe('GroupAdduser', () => {
  let component: GroupAdduser;
  let fixture: ComponentFixture<GroupAdduser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAdduser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAdduser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
