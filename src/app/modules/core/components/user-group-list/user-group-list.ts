import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupInterface, userGroupInterface } from '@app/models/group.model';
import { User } from '@app/models/user.model';
import { GroupService } from '@app/services/group/group.service';
import { ConfirmationModal } from '../../modal/confirmation-modal/confirmation-modal';


@Component({
  selector: 'app-user-group-list',
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './user-group-list.html',
  styleUrl: './user-group-list.scss',
})
export class UserGroupList implements OnInit {
  constructor(private groupService: GroupService, private cdr: ChangeDetectorRef, private dialog: MatDialog,public router:Router) {

  }
  private destroyRef = inject(DestroyRef);

  groupId: string | null = null;
  private route = inject(ActivatedRoute);


  groupData: userGroupInterface = {
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
    },
    userDetails: []
  }
  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.getGroupUserList(this.groupId!);
  }
  getGroupUserList(groupId: string) {
    this.groupService.getGroupById(groupId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        console.log("🚀 ~ UserGroupList ~ getGroupUserList ~ response:", response)
        this.groupData = response;
        this.cdr.markForCheck()
      })
  }
  deleteGroup() {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      width: '400px',
      data: { message : "Are you sure to delete",name: this.groupData.group.groupId ,delete :true}, // Optional: pass data
      disableClose: false // Prevents closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User clicked Confirm');
        const groupId   = this.groupId as string
        this.groupService.deleteGroup(groupId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response)=>{

          alert('Group Deleted')
          this.router.navigate(['grouplist'])
        })

      }
    });
  }

}

