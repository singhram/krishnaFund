import { Component, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '@app/models/user.model';
import { GroupService } from "@app/services/group/group.service";
import { UserService } from '@app/services/user.service';
import { GroupUserInterface } from '@app/models/group.model';

@Component({
  selector: 'app-group-adduser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-adduser.html',
  styleUrl: './group-adduser.scss',
})
export class GroupAdduser implements OnInit {
  public groupData: GroupUserInterface = {
    userDetails: [],
    group: {
      groupAmount: 0,
      baseAmount: 0,
      runningMonth: 0,
      balanceMonth: 0,
      net: 0,
      _id: "",
      groupId: "",
      numberOfmonths: 0,
      running: 0,
      balance: 0,
      auction: 0,
      interest: 0,
      takenBy: "",
      createdDate: "",
      users: [],
      id: "",
      totalnumberOfmonths: 0
    }

  };
  public allAvailableUsers: User[] = [];
  public filteredUsers: User[] = [];
  public searchTerm: string = '';

  constructor(
    public route: ActivatedRoute,
    public groupService: GroupService,
    public destroyRef: DestroyRef,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('groupid');
    if (idParam) {
      this.getGroupDetails(idParam);
    }
    this.loadUser();
  }

getGroupDetails(id: string) {
  this.groupService.getGroupById(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response: any) => {
        this.groupData = response as GroupUserInterface;
      },
      error: (err) => {
        console.error('Error fetching group:', err);
      }
    });
}
  loadUser() {
    this.userService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (userList: User[]) => {
          this.allAvailableUsers = userList;
        }
      });
  }

  // Logic to filter users as you type
  onSearchChange() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [];
      return;
    }
    this.filteredUsers = this.allAvailableUsers.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.phoneNumber?.includes(term)
    );
  }

  addUserToGroup(user: User) {
    console.log('Adding user:', user);
    // Logic to update your group list locally or via API
    this.searchTerm = '';
    this.filteredUsers = [];
  }
}