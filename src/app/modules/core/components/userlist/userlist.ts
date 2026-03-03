import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router'; // Required for links to work
import { User } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { ChangeDetectorRef } from '@angular/core'; // 1. Import this

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './userlist.html',
  styleUrl: './userlist.scss',
})
export class Userlist implements OnInit {
  public users: User[] =  []// Initialize as an empty array
  private destroyRef = inject(DestroyRef);
  constructor(private userservice: UserService, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.userservice.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef)) // Auto-cleanup magic
      .subscribe({
        next: (data: User[] ) => {
          this.users = data?.sort((a:any,b:any)=>a.name.localeCompare(b.name));
          console.log('Fetched users:', this.users);
          this.cdr.markForCheck(); // Manually trigger change detection
        },
        error: (err) => console.error(err)
      });
  }
  deleteUser(userId:string) {
    this.userservice.deleteUser(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          console.log(`User with ID ${userId} deleted successfully.`);
          this.getUsers(); // Refresh the user list after deletion
        },
        error: (err) => console.error(`Error deleting user with ID ${userId}:`, err)
      });
  } 
}