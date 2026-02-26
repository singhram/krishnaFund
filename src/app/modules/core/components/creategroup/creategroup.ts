import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { GroupService } from '@app/services/group/group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-creategroup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './creategroup.html',
  styleUrl: './creategroup.scss',
})
export class Creategroup implements OnInit {
  groupForm!: FormGroup;
  isEditMode = false;
  groupId: string | null = null;

  // Modern injection (Angular 20 style)
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
private destroyRef = inject(DestroyRef);
  constructor(public groupService: GroupService,public cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    // 1. Initialize the form structure
    this.initForm();

    // 2. Check for ID in URL (e.g., /group/edit/123)
    this.groupId = this.route.snapshot.paramMap.get('id');
    
    if (this.groupId) {
      this.isEditMode = true;
      this.loadGroupData(this.groupId);
    }
  }
  private initForm() {
    const today = new Date().toISOString().split('T')[0];
   this.groupForm = this.fb.group({
      groupId: ['', Validators.required],
      groupAmount: [0, Validators.required],
      baseAmount: [0, Validators.required],
      totalnumberOfmonths: [0, Validators.required],
      runningMonth: [0],
      balanceMonth: [0],
      net: [0],
      auction: [0],
      interest: [0],
      takenBy: ['Self'],
      createdDate: ['']
    });
    this.setupBalanceCalculation();
    this.setupInterestCalculation();
  }

  private loadGroupData(id: string) {
    // Replace this with your actual Service call: this.groupService.getById(id)
    const data = {
      groupId: "25n",
      groupAmount: 100000,
      baseAmount: 6250,
      totalnumberOfmonths: 16,
      runningMonth: 1,
      balanceMonth: 15,
      net: 6250,
      auction: 15000,
      interest: 150,
      takenBy: "Self",
      createdDate: "2023-10-27" // HTML date input needs YYYY-MM-DD
    };
    this.groupForm.patchValue(data);
  }
  private setupBalanceCalculation() {
  // Listen to changes on BOTH fields
  this.groupForm.valueChanges.subscribe(() => {
    const total = this.groupForm.get('totalnumberOfmonths')?.value || 0;
    const running = this.groupForm.get('runningMonth')?.value || 0;
    
    const balance = total - running;

    // Use patchValue to update the balanceMonth field
    this.groupForm.patchValue({
      balanceMonth: balance >= 0 ? balance : 0 // Ensure we don't show negative months
    }, { emitEvent: false }); // emitEvent: false prevents infinite loops
  });
}
 private setupInterestCalculation() {
  // Listen to changes on BOTH fields
  this.groupForm.valueChanges.subscribe(() => {
    const totalMonth = this.groupForm.get('totalnumberOfmonths')?.value || 0;
    const auction = this.groupForm.get('auction')?.value || 0;
    const baseAmount = this.groupForm.get('baseAmount')?.value;
    const interest =  (auction - baseAmount)/totalMonth;
    const AppliedInterest = Math.round(interest / 10) * 10;
    const netAmount = baseAmount - AppliedInterest;
    // Use patchValue to update the balanceMonth field
    this.groupForm.patchValue({
      interest: AppliedInterest// Ensure we don't show negative months
    }, { emitEvent: false }); // emitEvent: false prevents infinite loops
    this.groupForm.patchValue({
      net: netAmount// Ensure we don't show negative months
    }, { emitEvent: false }); // emitEvent: false prevents infinite loops
  });
}

  onSubmit() {
    if (this.groupForm.valid) {
      if (this.isEditMode) {
        console.log('Updating Group ID:', this.groupId, this.groupForm.value);
    
        // Call your update API here
      } else {
        console.log('Creating New Group:', this.groupForm.value);
        this.groupService.createGroup(this.groupForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
           this.groupForm.reset(); // Clear the form after successful creation
            // Optionally, navigate to the group list or show a success message
          },
          error: (error) => {
            console.error('Error creating group:', error);
            // Optionally, show an error message to the user
          }
        });
        // Call your create API here
      }
    } else {
      this.groupForm.markAllAsTouched();
    }
  }
}