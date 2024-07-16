import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-category-name',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule
  ],
  templateUrl: './text-input-dialog.component.html',
  styleUrl: './text-input-dialog.component.css'
})
export class TextInputDialog {


  constructor(
    public dialogRef: MatDialogRef<Component>,
    @Inject(MAT_DIALOG_DATA) public data: {prompt: string, name: string},
  ) {
    this.question = data.prompt;
    this.categoryName = data.name;
  }

  question: string = "Kategoria";

  categoryName: string = "";

  onYesClick(): void
  {
    this.dialogRef.close(this.categoryName);    
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

}
