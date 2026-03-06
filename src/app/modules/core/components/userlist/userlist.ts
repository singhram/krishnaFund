import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router'; // Required for links to work
import { User } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { ChangeDetectorRef } from '@angular/core'; // 1. Import this
import { ConfirmationModal } from '../../modal/confirmation-modal/confirmation-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './userlist.html',
  styleUrl: './userlist.scss',
})
export class Userlist implements OnInit {
  public users: User[] = []// Initialize as an empty array
  private destroyRef = inject(DestroyRef);
  constructor(private userservice: UserService, private cdr: ChangeDetectorRef, public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.userservice.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef)) // Auto-cleanup magic
      .subscribe({
        next: (data: User[]) => {
          this.users = data?.sort((a: any, b: any) => a.name.localeCompare(b.name));
          console.log('Fetched users:', this.users);
          this.cdr.markForCheck(); // Manually trigger change detection
        },
        error: (err) => console.error(err)
      });
  }
  deleteUser(user: any) {

    const dialogRef = this.dialog.open(ConfirmationModal, {
      width: '400px',
      data: { message: "Are you sure to delete", name: user.name, delete: true }, // Optional: pass data
      disableClose: false // Prevents closing by clicking outside
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.userservice.deleteUser(user.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.getUsers(); // Refresh the user list after deletion
            },
            error: (err) => console.error(`Error deleting user with ID ${user.name}:`, err)
          });

      }
    });


  }
}