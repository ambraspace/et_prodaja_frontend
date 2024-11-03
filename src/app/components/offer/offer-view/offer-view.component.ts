import { DatePipe, NgIf, PercentPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OfferService } from '../../../services/offer.service';
import { Page } from '../../../model/page';
import { Offer } from '../../../model/offer';
import { OfferStatusLocalizePipe } from '../../../pipes/offer-status-localize.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrEditOfferComponent } from '../add-or-edit-offer/add-or-edit-offer.component';
import { OfferFilter } from '../../../model/offer-filter';
import { OfferFilterComponent } from '../offer-filter/offer-filter.component';

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
    private router: Router,
    private route: ActivatedRoute
  ) { }


  offerFilter = new OfferFilter();


  ngOnInit(): void {

    this.route.queryParams.subscribe(pm => {

      let newOfferFilter = new OfferFilter();

      newOfferFilter.username = pm['u'];
      newOfferFilter.companyId = pm['c'];
      if (typeof pm['s'] === 'string')
        newOfferFilter.statuses = Array.of(pm['s']);
      else if (typeof pm['s'] === 'object')
        newOfferFilter.statuses = pm['s'];
      else
        newOfferFilter.statuses = [];
      newOfferFilter.productId = pm['p'];

      if (
        newOfferFilter.username ||
        newOfferFilter.companyId ||
        (newOfferFilter.statuses && newOfferFilter.statuses.length > 0) ||
        newOfferFilter.productId
      ) {
        this.offerFilter = newOfferFilter;
      } else {
        let ofs = localStorage.getItem('offerFilter');
        if (ofs)
          this.offerFilter = new OfferFilter(ofs);
        else
          this.offerFilter = newOfferFilter;
      }

      this.loadOffers();

    });

  }


  offers?: Page<Offer>;


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


  loadOffers(): void {
    this.offerService.getOffers(
      this.offerFilter.username,
      this.offerFilter.companyId,
      this.offerFilter.statuses,
      this.offerFilter.productId
    ).subscribe(o => {
      this.offers = o;
    });
  }


  addNewOffer(): void {

    let dialogRef = this.dialog.open<AddOrEditOfferComponent, any, Offer>(
      AddOrEditOfferComponent,
      { data: { offerId: undefined, offer: undefined }, width: "500px" }
    );

    dialogRef.afterClosed().subscribe(o => {
      if (o) {
        this.router.navigateByUrl("/offers/" + o.id);
      }
    })

  }


  updateTable(event: any): void {
    this.offerService.page = event.pageIndex;
    this.offerService.size = event.pageSize;
    this.loadOffers();
  }


  isOfferInvalid(o: Offer): boolean {
    let endDate = new Date()
    endDate.setHours(0, 0, 0, 0);

    if (o.status == 'ACTIVE' && (new Date(o.validUntil).valueOf() <= endDate.valueOf()))
      return true;

    return false;
  }


  openOfferFilter(): void {
    this.dialog.open<OfferFilterComponent, { filter: OfferFilter, callBack: ((filter: OfferFilter) => void) | undefined }, void>
      (
        OfferFilterComponent, { data: { filter: this.offerFilter, callBack: this.applyOfferFilter }, width: "400px" }
      )
  }


  isFilterApplied(): boolean {
    
    if (this.offerFilter)
    {
      if (
        this.offerFilter.username ||
        this.offerFilter.companyId ||
        (this.offerFilter.statuses && this.offerFilter.statuses.length > 0) ||
        this.offerFilter.productId
      ) return true
      else return false;
    } else {
      return false;
    }
    
  }


  applyOfferFilter = (of: OfferFilter) => {

    if (!of) return;

    localStorage.setItem('offerFilter', JSON.stringify(of));
    this.offerService.page = 0;
    this.offerFilter = of;

    if (this.router.url != "/offers")
    {
      this.router.navigateByUrl("/offers");
    } else {
      this.loadOffers();
    }

  }

}
