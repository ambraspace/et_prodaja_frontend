import { DatePipe, NgIf, PercentPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OfferService } from '../../../services/offer.service';
import { Page } from '../../../model/page';
import { Offer } from '../../../model/offer';
import { OfferStatusLocalizePipe } from '../../../pipes/offer-status-localize.pipe';
import { Router, RouterLink } from '@angular/router';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrEditOfferComponent } from '../add-or-edit-offer/add-or-edit-offer.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-offer-view',
  standalone: true,
  imports: [
    NgIf,
    MatPaginator,
    MatTableModule,
    MatButtonModule,
    DatePipe, CurrencyPipe, ToEuroPipe, PercentPipe, OfferStatusLocalizePipe,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './offer-view.component.html',
  styleUrl: './offer-view.component.css'
})
export class OfferViewComponent implements OnInit {

  constructor(
    private offerService: OfferService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  offers: Page<Offer> | null = null;

  get offerList(): Offer[]
  {
    if (this.offers)
      return this.offers.content;
    else
      return [];
  }

  displayedColumns: string[] = [
    'id',
    'company',
    'offerDate',
    'validUntil',
    'status',
    'cost',
    'margin',
    'value',
    'comment',
    'actions'
  ]

  loadOffers(): void
  {
    this.offerService.getOffers().subscribe(o => {
      this.offers = o;
    });
  }


  addNewOffer(): void
  {

    let dialogRef = this.dialog.open<AddOrEditOfferComponent, any, Offer>(
      AddOrEditOfferComponent,
      {data: {offerId: undefined, offer: undefined}, width: "500px"}
    );

    dialogRef.afterClosed().subscribe(o => {
      if (o)
      {
        this.router.navigateByUrl("/offers/" + o.id );
      }
    })

  }


  editOffer(offerId: number)
  {

  }


  deleteOffer(offerId: number)
  {

  }


  updateTable(event: any): void
  {
    this.offerService.page = event.pageIndex;
    this.offerService.size = event.pageSize;
    this.loadOffers();
  }


  isOfferInvalid(o: Offer): boolean
  {
    let endDate = new Date()  
    endDate.setHours(0,0,0,0);
    
    if (o.status == 'ACTIVE' && (new Date(o.validUntil).valueOf() <= endDate.valueOf()))
      return true;

    return false;
  }
}
