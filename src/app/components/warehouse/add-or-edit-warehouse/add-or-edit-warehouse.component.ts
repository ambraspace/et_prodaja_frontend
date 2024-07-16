import { Component, Inject } from '@angular/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Warehouse } from '../../../model/warehouse';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-or-edit-warehouse',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './add-or-edit-warehouse.component.html',
  styleUrl: './add-or-edit-warehouse.component.css'
})
export class AddOrEditWarehouseComponent {


  constructor(
    private warehousetService: WarehouseService,
    public dialogRef: MatDialogRef<AddOrEditWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {action: string, companyId: number, warehouse: Warehouse}
  ) {
    if (data.action == 'EDIT')
    {
      this.warehouseForm.patchValue(data.warehouse);
    }
  }


  warehouseForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('')
  });



  cancel(): void
  {
    this.dialogRef.close();
  }


  save(): void
  {

    if (this.data.action == 'ADD')
    {
      this.warehousetService.addWarehouse(this.data.companyId, this.warehouseForm.value as Warehouse).subscribe((u) => {
        this.dialogRef.close(u);
      });
    } else if (this.data.action == 'EDIT')
    {
      this.warehousetService.updateWarehouse(this.data.companyId, this.data.warehouse.id, this.warehouseForm.value as Warehouse).subscribe((u) => {
        this.dialogRef.close(u);
      });
    } else {
      this.dialogRef.close();
    }

  }


}
