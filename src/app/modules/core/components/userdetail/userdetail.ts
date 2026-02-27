import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@app/models/user.model';
import { GroupInterface } from '@app/models/group.model';


@Component({
  selector: 'app-userdetail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './userdetail.html',
  styleUrl: './userdetail.scss',
})
export class Userdetail implements OnInit {
  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {

  }
  private destroyRef = inject(DestroyRef);

  userId: string | null = null;
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.getUserTotalAmount();
  }
  public userDetails: userdetail = {
    userDetail: {
      name: "",
      userId: "",
      phoneNumber: ""
    },
    userGroups: []
  };

  // Calculate the total balance
  get totalBalance(): number {
    return this.userDetails.userGroups.reduce((sum, item) => sum + item.net, 0);
  }
  getUserTotalAmount() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userService.getGroupsbyUserID(this.userId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        console.log("🚀 ~ UserGroupList ~ getGroupUserList ~ response:", response)
        this.userDetails = response
        this.cdr.markForCheck()
      })

  }
}

interface userdetail {
  userDetail: User,
  userGroups: GroupInterface[]
}