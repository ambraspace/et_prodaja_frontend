import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OfferFilter } from '../../../model/offer-filter';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/user.service';
import { Page } from '../../../model/page';
import { User } from '../../../model/user';

@Component({
  selector: 'app-offer-filter',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule, MatButtonToggleModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './offer-filter.component.html',
  styleUrl: './offer-filter.component.css'
})
export class OfferFilterComponent implements OnInit {

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) private data: {filter: OfferFilter, callBack: ((filter: OfferFilter) => void) | undefined}
  ) {
    if (data.filter)
    {
      this.offerFilter = new OfferFilter();
      this.offerFilter.username = data.filter.username;
      this.offerFilter.companyId = data.filter.companyId;
      this.offerFilter.statuses = data.filter.statuses;
      this.offerFilter.productId = data.filter.productId;
    } else {
      this.offerFilter = new OfferFilter();
    }
    if (data.callBack)
    {
      this.callBack = data.callBack;
    }
  }


  offerFilter: OfferFilter;


  private callBack?: (filter: OfferFilter) => void;


  userPage?: Page<User>;


  ngOnInit(): void {
    // TODO: Riješiti za slučaj kad je više od 10 korisnika u sistemu!
    this.userService.getUsers().subscribe(u => this.userPage = u);  
  }


  cancelFilter(): void
  {

    this.offerFilter.username = undefined;
    this.offerFilter.companyId = undefined;
    this.offerFilter.statuses = [];
    this.offerFilter.productId = undefined;

    if (this.callBack)
    {
      this.callBack(new OfferFilter());
    }

  }


  applyFilter(): void
  {
    if (this.callBack)
    {

      let retVal = new OfferFilter();
      retVal.username = this.offerFilter.username;
      retVal.companyId = this.offerFilter.companyId;
      retVal.statuses = this.offerFilter.statuses;
      retVal.productId = this.offerFilter.productId;

      this.callBack(retVal);
    }
  }


}
