import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../model/warehouse';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrEditWarehouseComponent } from '../add-or-edit-warehouse/add-or-edit-warehouse.component';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-warehouse-view',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './warehouse-view.component.html',
  styleUrl: './warehouse-view.component.css'
})
export class WarehouseViewComponent implements OnInit
{

  constructor(
    private warehouseService: WarehouseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  @Input()
  companyId!: number;

  warehouses: Warehouse[] = []

  displayedColumns: string[] = ['name', 'actions']

  loadWarehouses(): void
  {
    this.warehouseService.getWarehouses(this.companyId).subscribe(ws => this.warehouses = ws);
  }

  addWarehouse(): void
  {

    let dialogRef = this.dialog.open(AddOrEditWarehouseComponent, {data: {action: "ADD", companyId: this.companyId}});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadWarehouses();
        this.snackBar.open("Skladište je dodato", undefined, {duration: 3000});
      }
    });

  }


  editWarehouse(warehouse: Warehouse): void
  {

    let dialogRef = this.dialog.open(AddOrEditWarehouseComponent, {data: {action: "EDIT", companyId: this.companyId, warehouse: warehouse}});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadWarehouses();
        this.snackBar.open("Skladište je izmijenjeno", undefined, {duration: 3000});
      }
    });

  }


  deleteWarehouse(warehouse: Warehouse): void
  {

    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: `Želite li obrisati skladište "${warehouse.name}"?`});

    dialogRef.afterClosed().subscribe(result => {
      if (result === "YES")
      {
        this.warehouseService.deleteWarehouse(this.companyId, warehouse.id).subscribe(() => {
          this.loadWarehouses();
          this.snackBar.open("Skladište je obrisano", undefined, {duration: 3000});
        });
      }
    });

  }

}
