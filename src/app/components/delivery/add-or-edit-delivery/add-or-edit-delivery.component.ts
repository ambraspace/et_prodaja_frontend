import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DeliveryFormComponent } from '../delivery-form/delivery-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Delivery } from '../../../model/delivery';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
    selector: 'app-add-or-edit-delivery',
    imports: [
        DeliveryFormComponent,
        MatButtonModule,
        MatDialogModule
    ],
    templateUrl: './add-or-edit-delivery.component.html',
    styleUrl: './add-or-edit-delivery.component.css'
})
export class AddOrEditDeliveryComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<AddOrEditDeliveryComponent, Delivery>,
    @Inject(MAT_DIALOG_DATA) private data: {deliveryId: string, delivery: Delivery},
    private deliveryService: DeliveryService
  ) {}


  ngOnInit(): void {
    if (this.data && this.data.deliveryId)
    {
      this.loadDelivery();
    }
  }


  @ViewChild('deliveryForm') deliveryFormComponent!: DeliveryFormComponent;


  loadDelivery(): void
  {
    this.deliveryService.getDelivery(this.data.deliveryId).subscribe(d => {
      this.delivery = d
    })
  }


  delivery?: Delivery


  saveDelivery(): void
  {
    if (this.deliveryFormComponent.deliveryFormIsValid)
    {
      let dlv: Delivery = this.deliveryFormComponent.delivery;
      if (this.data.deliveryId)
      {
        this.deliveryService.updateDelivery(this.data.deliveryId, this.deliveryFormComponent.delivery).subscribe(d => {
          this.dialogRef.close(d);
        })
      } else {
        this.deliveryService.addDelivery(this.deliveryFormComponent.delivery).subscribe(d => {
          this.dialogRef.close(d);
        })
      }
    }
  }


  closeDialog(): void
  {
    this.dialogRef.close();
  }


}
