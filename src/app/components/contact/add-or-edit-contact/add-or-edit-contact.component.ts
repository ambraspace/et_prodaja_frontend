import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../../model/contact';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-or-edit-contact',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatButtonModule
  ],
  templateUrl: './add-or-edit-contact.component.html',
  styleUrl: './add-or-edit-contact.component.css'
})
export class AddOrEditContactComponent {

  constructor(
    private contactService: ContactService,
    public dialogRef: MatDialogRef<AddOrEditContactComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {action: string, companyId: number, contact: Contact}
  ) {
    if (data.action == 'EDIT')
    {
      this.contactForm.patchValue(data.contact);
    }
  }


  contactForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    comment: new FormControl('')
  });



  cancel(): void
  {
    this.dialogRef.close();
  }


  save(): void
  {

    if (this.data.action == 'ADD')
    {
      this.contactService.addContact(this.data.companyId, this.contactForm.value as Contact).subscribe((u) => {
        this.dialogRef.close(u);
      });
    } else if (this.data.action == 'EDIT')
    {
      this.contactService.updateContact(this.data.companyId, this.data.contact.id, this.contactForm.value as Contact).subscribe((u) => {
        this.dialogRef.close(u);
      });
    } else {
      this.dialogRef.close();
    }

  }


}
