import { Component, Input } from '@angular/core';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../model/contact';
import { NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddOrEditContactComponent } from '../add-or-edit-contact/add-or-edit-contact.component';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';

@Component({
    selector: 'app-contact-view',
    imports: [NgIf, NgFor, MatTableModule, MatButtonModule],
    templateUrl: './contact-view.component.html',
    styleUrl: './contact-view.component.css'
})
export class ContactViewComponent {

  constructor(
    private contactService: ContactService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  @Input()
  companyId!: number;

  contacts: Contact[] = []

  displayedColumns:string[] = ['name', 'email', 'phone', 'comment', 'actions'];

  loadContacts(): void
  {
    this.contactService.getContacts(this.companyId).subscribe(cs => this.contacts = cs);
  }


  addContact(): void
  {

    let dialogRef = this.dialog.open(AddOrEditContactComponent, {data: {action: "ADD", companyId: this.companyId}});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadContacts();
        this.snackBar.open("Kontakt je dodat", undefined, {duration: 3000});
      }
    });

  }


  editContact(contact: Contact): void
  {

    let dialogRef = this.dialog.open(AddOrEditContactComponent, {data: {action: "EDIT", companyId: this.companyId, contact: contact}});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadContacts();
        this.snackBar.open("Kontakt je izmijenjen", undefined, {duration: 3000});
      }
    });

  }


  deleteContact(contact: Contact): void
  {

    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: `Želite li obrisati kontakt "${contact.name}"?`});

    dialogRef.afterClosed().subscribe(result => {
      if (result === "YES")
      {
        this.contactService.deleteContact(this.companyId, contact.id).subscribe(() => {
          this.loadContacts();
          this.snackBar.open("Kontakt je obrisan", undefined, {duration: 3000});
        });
      }
    });

  }


}
