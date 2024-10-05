import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DeliveryService } from '../../../services/delivery.service';
import { Page } from '../../../model/page';
import { Delivery } from '../../../model/delivery';
import { DeliveryStatusLocalizePipe } from '../../../pipes/delivery-status-localize.pipe';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { AddOrEditDeliveryComponent } from '../add-or-edit-delivery/add-or-edit-delivery.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-delivery-view',
  standalone: true,
  imports: [NgIf,
    MatTableModule, MatPaginator,
    MatButtonModule,
    DatePipe, CurrencyPipe, ToEuroPipe, DeliveryStatusLocalizePipe,
    RouterLink
  ],
  templateUrl: './delivery-view.component.html',
  styleUrl: './delivery-view.component.css'
})
export class DeliveryViewComponent implements OnInit {

  constructor(
    private deliveryService: DeliveryService,
    private dialog: MatDialog,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  deliveries: Page<Delivery> | null = null;

  displayedColumns: string[] = [
    'id',
    'supplier',
    'reference',
    'status',
    'deliveryDate',
    'value',
    'comment',
    'actions'
  ]

  get deliveryList(): Delivery[]
  {
    if (this.deliveries)
      return this.deliveries.content;
    else
    return []
  }

  loadDeliveries(): void
  {
    this.deliveryService.getDeliveries().subscribe(d => this.deliveries = d)
  }


  addNewDelivery(): void
  {

    let dialogRef = this.dialog.open<AddOrEditDeliveryComponent, any, Delivery>(
      AddOrEditDeliveryComponent,
      {data: {deliveryId: undefined, delivery: undefined}, width: "500px"}
    );

    dialogRef.afterClosed().subscribe(d => {
      if (d)
      {
        this.router.navigateByUrl("/deliveries/" + d.id );
      }
    })

  }



  editDelivery(id: number): void
  {

  }


  deleteDelivery(id: number): void
  {

  }


  updateTable(event: any): void
  {
    this.deliveryService.page = event.pageIndex;
    this.deliveryService.size = event.pageSize;
    this.loadDeliveries();
  }

}
