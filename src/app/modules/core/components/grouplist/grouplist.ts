import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GroupService } from '@app/services/group/group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupInterface } from '@app/models/group.model';

@Component({
  selector: 'app-grouplist',
  imports: [CommonModule, RouterLink],
  templateUrl: './grouplist.html',
  styleUrl: './grouplist.scss',
})
export class Grouplist implements OnInit {
   private destroyRef = inject(DestroyRef);
  constructor(public groupService: GroupService,public cdr: ChangeDetectorRef) {}
  public groupList :GroupInterface[]
  =  []
ngOnInit(): void {
    this.getGroupList();
}
getGroupList() {  
  this.groupService.getGroups()
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe({
    next: (response) => {
      console.log('Groups fetched:', response);
      this.groupList = response;
      this.cdr.markForCheck(); // Manually trigger change detection after updating the group list
    },
    error: (error) => {
      console.error('Error fetching groups:', error);
    }
  });
}
 
}
