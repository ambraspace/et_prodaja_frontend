import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/user';
import { Page } from '../../../model/page';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';
import { AddOrEditUserComponent } from '../add-or-edit-user/add-or-edit-user.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRolePipe } from '../../../pipes/user-role.pipe';
import { UserRole } from '../../../model/user-role';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, NgIf, MatPaginator, MatDialogModule, MatSnackBarModule, UserRolePipe],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnInit {

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  users: Page<User> | null = null;

  displayedColumns: string[] = ['username', 'role', 'fullName', 'company', 'email', 'phone', 'actions']

  get userList(): User[]
  {
    if (this.users)
      return this.users!.content;
    else
      return []
  }

  loadUsers(): void
  {
    this.userService.getUsers().subscribe(u => this.users = u);
  }


  addUser(): void
  {

    let dialogRef = this.dialog.open(AddOrEditUserComponent, {data: {action: "ADD"}});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadUsers();
        this.snackBar.open("Korisnik je dodat", undefined, {duration: 3000});
      }
    });

  }


  editUser(user: User): void
  {

    let dialogRef = this.dialog.open(AddOrEditUserComponent, {data: {action: "EDIT", user: user}});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadUsers();
        this.snackBar.open("Korisnik je izmijenjen", undefined, {duration: 3000});
      }
    });

  }


  deleteUser(username: string): void
  {

    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: `Želite li obrisati korisnika "${username}"?`});

    dialogRef.afterClosed().subscribe(result => {
      if (result === "YES")
      {
        this.userService.deleteUser(username).subscribe(() => {
          this.loadUsers();
          this.snackBar.open("Korisnik je obrisan", undefined, {duration: 3000});
        });
      }
    });

  }


  updateTable(event: any): void
  {
    this.userService.page = event.pageIndex;
    this.userService.size = event.pageSize;
    this.loadUsers();
  }

}
