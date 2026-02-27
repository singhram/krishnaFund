import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { GroupService } from '@app/services/group/group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupUserInterface } from '@app/models/group.model';
import { GroupUser } from '../../utils/group';

@Component({
  selector: 'app-creategroup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './creategroup.html',
  styleUrl: './creategroup.scss',
})
export class Creategroup implements OnInit {
  groupForm!: FormGroup;
  isEditMode = false;
  groupId: string | null = null;
  groupData = new GroupUser();
  // Modern injection (Angular 20 style)
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  constructor(public groupService: GroupService, public cdr: ChangeDetectorRef) { }
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
    console.log('id: ', id);
    // Replace this with your actual Service call: this.groupService.getById(id)
    this.groupService.getGroupById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const groupData = response as GroupUserInterface;
          this.groupData = new GroupUser(groupData)
          console.log('this.groupData : ', this.groupData);
          this.groupForm.patchValue(groupData.group);
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error('Error fetching group:', err);
        }
      });

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
      const interest = (auction - baseAmount) / totalMonth;
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
      let groupEditAddSubscription = this.groupService.createGroup(this.groupForm.value);
      if (this.isEditMode) {
        let groupBody = { ...this.groupForm.value, users: this.groupData.userDetails.map(v => v.userId) }
        groupEditAddSubscription = this.groupService.updateGroup(this.groupData.group._id, groupBody)
      }
      groupEditAddSubscription
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.groupForm.reset(); // Clear the form after successful creation
          },
          error: (error) => {
            console.error('Error creating group:', error);
          }
        });
    } else {
      this.groupForm.markAllAsTouched();
    }
  }
}