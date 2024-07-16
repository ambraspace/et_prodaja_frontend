import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../model/item';
import { Offer } from '../../../model/offer';
import { OfferService } from '../../../services/offer.service';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [
    MatTableModule,
    DecimalPipe,
    PercentPipe,
    CurrencyPipe,
    ToEuroPipe,
    RouterLink
  ],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.css'
})
export class OfferDetailsComponent implements OnInit {

  constructor(
    private offerService: OfferService,
    private itemService: ItemService
  ) {}


  @Input()
  set id(id: string)
  {
    this.offerId = id;
  }


  offerId!: string;

  offer: Offer | undefined;

  items: Item[] = [];

  displayedColumns = ['no', 'productName', 'unit', 'quantity', 'price', 'discount', 'netPrice', 'value', 'actions'];


  ngOnInit(): void {
    this.loadOffer();
    this.loadItems();
  }


  loadOffer(): void
  {
    this.offerService.getOffer(this.offerId).subscribe(o => {
      this.offer = o;
    });
  }


  loadItems(): void
  {
    this.itemService.getOfferItems(this.offerId).subscribe((p) => {
      this.items = p;
    })
  }

}
