import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { OfferFormComponent } from "../offer-form/offer-form.component";
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Offer } from '../../../model/offer';
import { OfferService } from '../../../services/offer.service';

@Component({
    selector: 'app-add-or-edit-offer',
    imports: [
        OfferFormComponent,
        MatButtonModule,
        MatDialogModule
    ],
    templateUrl: './add-or-edit-offer.component.html',
    styleUrl: './add-or-edit-offer.component.css'
})
export class AddOrEditOfferComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<AddOrEditOfferComponent, Offer>,
    @Inject(MAT_DIALOG_DATA) private data: {offerId: string, offer: Offer},
    private offerService: OfferService
  ) {}


  ngOnInit(): void {
    if (this.data && this.data.offerId)
    {
      this.loadOffer();
    }
  }


  @ViewChild('offerForm') offerFormComponent!: OfferFormComponent;


  loadOffer(): void
  {
    this.offerService.getOffer(this.data.offerId).subscribe(o => this.offer = o)
  }


  offer?: Offer


  saveOffer(): void
  {
    if (this.offerFormComponent.offerFormIsValid)
    {
      let ofr: Offer = this.offerFormComponent.offer;
      if (this.data.offerId)
      {
        this.offerService.updateOffer(this.data.offerId, this.offerFormComponent.offer).subscribe(o => {
          this.dialogRef.close(o);
        })
      } else {
        this.offerService.addOffer(this.offerFormComponent.offer).subscribe(o => {
          this.dialogRef.close(o);
        })
      }
    }
  }


  closeDialog(): void
  {
    this.dialogRef.close();
  }


}
