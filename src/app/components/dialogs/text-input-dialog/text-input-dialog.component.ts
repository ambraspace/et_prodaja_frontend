import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-category-name',
    imports: [
        MatButtonModule,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatDialogModule,
        CdkTextareaAutosize
    ],
    templateUrl: './text-input-dialog.component.html',
    styleUrl: './text-input-dialog.component.css'
})
export class TextInputDialog {


  constructor(
    public dialogRef: MatDialogRef<Component>,
    @Inject(MAT_DIALOG_DATA) public data: {placeholder: string, defaultValue: string, allowEmpty: boolean, multiline: boolean},
  ) {
    this.placeholder = data.placeholder;
    this.enteredValue = data.defaultValue;
    this.allowEmpty = data.allowEmpty;
    this.multiline = data.multiline;
  }

  placeholder: string = "";
  enteredValue: string = "";
  allowEmpty: boolean = true;
  multiline: boolean = false;


  isBlank(value: string): boolean
  {
    if (value && value.trim() != "")
      return false;
    return true;
  }


  onYesClick(): void
  {
    this.dialogRef.close(this.enteredValue);
  }


  onNoClick(): void
  {
    this.dialogRef.close();
  }

}
