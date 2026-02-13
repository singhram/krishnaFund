import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { M } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './createuser.html',
  styleUrl: './createuser.scss',
})
export class Createuser implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  constructor() { }
  ngOnInit(): void {
    this.initForm();

    // Check for ID in the URL param
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loadUserData(idParam);
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      // ID is disabled by default as requested
      userId: [{ value: '' }],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['9999999999', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      otherName: ['']
    });
  }

  private loadUserData(userId: string) {

    // Simulating an API fetch

    this.userService.getUserById(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const mockData = {
            userId: data.userId,
            name: data.name,
            phoneNumber: data.phoneNumber,
            otherName: '' // You can replace this with actual data if available
          };
          this.userForm.patchValue(mockData);
        },
        error: (err) => console.error(err)
      });


  }

  onSubmit() {
    if (this.userForm.valid) {
      // Use getRawValue() to include the disabled 'userId' field in the object
      const formData = this.userForm.getRawValue();

      if (this.isEditMode) {
        this.userService.patchUser(formData.userId, formData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              // this.initForm(); // Reset form after successful update
              this.userForm.reset();
            },
            error: (err) => console.error('Error updating user:', err)
          });
      } else {

        this.userService.createUser({ name: formData.name, phoneNumber: formData.phoneNumber })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              //  this.initForm(); 
                this.userForm.reset();
              },// Reset form after successful update},
            error: (err) => console.error('Error creating user:', err)
          });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}