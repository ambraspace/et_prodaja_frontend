import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Delivery } from '../../../model/delivery';
import { ItemService } from '../../../services/item.service';
import { DeliveryItem } from '../../../model/delivery-item';
import { Page } from '../../../model/page';
import { Item } from '../../../model/item';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { DeliveryItemService } from '../../../services/delivery-item.service';

@Component({
    selector: 'app-item-selector',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        RouterLink
    ],
    templateUrl: './item-selector.component.html',
    styleUrl: './item-selector.component.css'
})
export class ItemSelectorComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<ItemSelectorComponent, DeliveryItem[]>,
    @Inject(MAT_DIALOG_DATA) private data: {delivery: Delivery},
    private itemService: ItemService,
    private deliveryItemService: DeliveryItemService
  ) {
    this.delivery = data.delivery;
  }


  delivery?: Delivery;


  itemsPage?: Page<Item>;


  get items(): Item[]
  {
    if (this.itemsPage)
    {
      return this.itemsPage.content;
    } else {
      return [];
    }
  }


  private deliveryQtys = new Map<number, number>();

  
  private deliveryNotes = new Map<number, string>();


  displayedColumns = ['reference', 'offer', 'order', 'quantity', 'deliveredQty', 'deliveryNote'];


  ngOnInit(): void {
    this.loadItems();
  }


  loadItems(): void
  {
    if (this.delivery)
    {
      this.itemService.getUnorderedItems(this.delivery.supplier.id).subscribe(pi => this.itemsPage = pi);
    }
  }


  updateTable(event: any): void
  {
    this.itemService.page = event.pageIndex;
    this.itemService.size = event.pageSize;
    this.loadItems();
  }


  updateQty(itemId: number, $event: any): void
  {
    let qty: number = $event.target.value;
    if (qty > 0)
    {
      this.deliveryQtys.set(itemId, qty);
    } else {
      this.deliveryQtys.delete(itemId);
    }
  }


  updateNote(itemId: number, $event: any): void
  {
    let note: string = $event.target.value;
    if (note && note.trim() != "")
    {
      this.deliveryNotes.set(itemId, note);
    } else {
      this.deliveryNotes.delete(itemId);
    }
  }


  getDeliveryQty(itemId: number): number
  {
    return this.deliveryQtys.get(itemId) ? this.deliveryQtys.get(itemId)! : 0;
  }


  getDeliveryNote(itemId: number): string
  {
    return this.deliveryNotes.get(itemId) ? this.deliveryNotes.get(itemId)! : "";
  }


  save(): void
  {
    if (this.deliveryQtys.size > 0 && this.delivery)
    {
      let dis: DeliveryItem[] = [];
      this.deliveryQtys.forEach((value, key) => {
        dis.push({
          item: {
            id: key
          } as Item,
          quantity: value,
          deliveryNote: this.deliveryNotes.get(key)
        })
      });

      this.deliveryItemService.addDeliveryItems(this.delivery.id, dis).subscribe(ds => {
        this.dialogRef.close(ds);
      });
      
    }
  }



}
