import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.css'
})
export class YesNoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<Component>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { this.question = data }

  question: string = "Molim potvrdite";

  onYesClick(): void
  {
    this.dialogRef.close("YES");    
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

}

