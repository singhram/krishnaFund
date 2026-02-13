import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupInterface } from '@app/models/group.model';
import { User } from '@app/models/user.model';
import { GroupService } from '@app/services/group/group.service';
 

@Component({
  selector: 'app-user-group-list',
  imports: [CommonModule,DatePipe,RouterLink],
  templateUrl: './user-group-list.html',
  styleUrl: './user-group-list.scss',
})
export class UserGroupList implements OnInit {
 constructor(private groupService: GroupService, private cdr: ChangeDetectorRef){
  
 }
  private destroyRef = inject(DestroyRef);

  groupId: string | null = null;
  private route = inject(ActivatedRoute);
  

  groupData:userGroupInterface = {
    group:{
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
  users:[],
  id: "",
  totalnumberOfmonths:0
    },
    userDetails:[]
  }
ngOnInit(){
  this.groupId = this.route.snapshot.paramMap.get('groupId');
  this.getGroupUserList(this.groupId!);
}
getGroupUserList(groupId:string){
    this.groupService.getGroupById(groupId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((response:any)=>{
    console.log("🚀 ~ UserGroupList ~ getGroupUserList ~ response:", response)
      this.groupData = response;
      this.cdr.markForCheck()
    })
}
  
}

interface userGroupInterface {
   group: GroupInterface
  userDetails: User[]
}