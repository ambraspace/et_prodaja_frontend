import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from '../../../model/company';
import { CompanyViewComponent } from '../company-view/company-view.component';
import { MatInput, MatLabel, MatFormField } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-add-company-dialog',
    imports: [MatInput, MatLabel, MatFormField, FormsModule, MatButtonModule],
    templateUrl: './add-company-dialog.component.html',
    styleUrl: './add-company-dialog.component.css'
})
export class AddCompanyDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Company,
    public dialogRef: MatDialogRef<CompanyViewComponent>
  ) { }

  formData: Company = {
    id: this.data.id,
    name: this.data.name,
    locality: this.data.locality
  }

  onConfirm(): void
  {
    this.dialogRef.close(this.formData);
  }

  onClose(): void
  {
    this.dialogRef.close();
  }
  
}
