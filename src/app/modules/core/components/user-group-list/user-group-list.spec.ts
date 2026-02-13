import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupList } from './user-group-list';

describe('UserGroupList', () => {
  let component: UserGroupList;
  let fixture: ComponentFixture<UserGroupList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGroupList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGroupList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
