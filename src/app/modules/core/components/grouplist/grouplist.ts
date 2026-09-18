import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GroupService } from '@app/services/group/group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupInterface } from '@app/models/group.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { Creategroup } from '../creategroup/creategroup';

@Component({
  selector: 'app-grouplist',
  imports: [CommonModule, RouterLink, MatExpansionModule, Creategroup],
  templateUrl: './grouplist.html',
  styleUrl: './grouplist.scss',
})
export class Grouplist implements OnInit {
  private destroyRef = inject(DestroyRef);
  constructor(public groupService: GroupService, public cdr: ChangeDetectorRef) {}

  public groupList: GroupInterface[] = [];

  /** ID of the group currently open in inline-edit mode. null = no inline edit open. */
  public inlineEditGroupId: string | null = null;

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
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching groups:', error);
        }
      });
  }

  /** Toggle inline edit panel for a group. Clicking same group again closes it. */
  toggleInlineEdit(groupId: string): void {
    this.inlineEditGroupId = this.inlineEditGroupId === groupId ? null : groupId;
  }

  /** Close the inline edit panel */
  closeInlineEdit(): void {
    this.inlineEditGroupId = null;
  }
}
