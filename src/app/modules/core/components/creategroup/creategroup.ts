import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { GroupService } from '@app/services/group/group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupUserInterface } from '@app/models/group.model';
import { GroupUser } from '../../utils/group';
import { merge } from 'rxjs';

@Component({
  selector: 'app-creategroup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './creategroup.html',
  styleUrl: './creategroup.scss',
})
export class Creategroup implements OnInit {
  /** When used as an inline embedded component, pass the group id via this input.
   *  If provided it takes precedence over the route param. */
  @Input() inputGroupId: string | null = null;

  /** Emitted after a successful create or update API call. Parent can listen to refresh its list. */
  @Output() groupSaved = new EventEmitter<void>();
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

    // 2. Prefer inputGroupId (inline mode) over route param
    this.groupId = this.inputGroupId ?? this.route.snapshot.paramMap.get('id');

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
  // 1. Only listen to fields that REQUIRE a recalculation of interest
  // We use merge to watch multiple specific controls instead of the whole form

  const triggerFields = merge(
    this.groupForm.get('totalnumberOfmonths')!.valueChanges,
    this.groupForm.get('auction')!.valueChanges,
    this.groupForm.get('baseAmount')!.valueChanges
  );

  triggerFields.subscribe(() => {
    const values = this.groupForm.getRawValue();
    const totalMonth = values.totalnumberOfmonths || 0;
    const auction = values.auction || 0;
    const baseAmount = values.baseAmount || 0;

    if (totalMonth > 0) {
      const calculatedInterest = (auction - baseAmount) / totalMonth;
      const appliedInterest = Math.round(calculatedInterest / 10) * 10;
      const netAmount = baseAmount - appliedInterest;

      this.groupForm.patchValue({
        interest: appliedInterest,
        net: netAmount
      }, { emitEvent: false }); // This prevents the 'interest' listener below from firing
    }
  });

  // 2. Listen to manual interest changes to update NET only
  this.groupForm.get('interest')?.valueChanges.subscribe((manualInterest) => {
    const baseAmount = this.groupForm.get('baseAmount')?.value || 0;
    const netAmount = baseAmount - (manualInterest || 0);

    this.groupForm.patchValue({
      net: netAmount
    }, { emitEvent: false });
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
            
            this.groupSaved.emit();  // Notify parent to refresh the group list
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