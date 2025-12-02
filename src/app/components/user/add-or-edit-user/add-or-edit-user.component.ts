import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../model/company';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '../../../model/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../model/user-role';
import { UserRolePipe } from '../../../pipes/user-role.pipe';

@Component({
    selector: 'app-add-or-edit-user',
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatAutocompleteModule,
        AsyncPipe,
        ReactiveFormsModule,
        UserRolePipe,
    ],
    templateUrl: './add-or-edit-user.component.html',
    styleUrl: './add-or-edit-user.component.css'
})
export class AddOrEditUserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<AddOrEditUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {action: string, user: User}
  ) {
    if (data.action == 'EDIT')
    {
      this.userForm.patchValue(data.user);
      this.userForm.get('username')!.disable();
    }
  }


  companies$!: Observable<Company[]>;

  private searchText$ = new Subject<string>();

  roleTypes: UserRole[] = ['ADMIN', 'USER', 'CUSTOMER'];


  userForm = new FormGroup(
    {
      username: new FormControl<string>('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
      role: new FormControl<UserRole>('USER'),
      fullName: new FormControl<string>('', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
      company: new FormControl<Company | undefined>(undefined , [Validators.required]),
      phone: new FormControl<string>('', [Validators.required, Validators.pattern('[\\d-()/+ ]*')]),
      email: new FormControl<string>('', [Validators.email]),
      signature: new FormControl<string>('', [Validators.required]),
      canViewPrices: new FormControl<boolean>(true)
    }
  );

  ngOnInit(): void {

    this.companies$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.companyService.searchCompanies(query, 5))
    );

  }



  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  search(packageName: string) {
    this.searchText$.next(packageName);
  }


  companyToCompanyName(c: Company): string
  {
    if (c)
      return c.name + " (" + c.locality + ")";

    return "";
  }


  cancel(): void
  {
    this.dialogRef.close();
  }


  save(): void
  {

    if (this.data.action == 'ADD')
    {
      this.userService.addUser(this.userForm.value as User).subscribe((u) => {
        this.dialogRef.close(u);
      });
    } else if (this.data.action == 'EDIT')
    {
      this.userService.updateUser(this.data.user.username, this.userForm.value as User).subscribe((u) => {
        this.dialogRef.close(u);
      });
    } else {
      this.dialogRef.close();
    }

  }

}
