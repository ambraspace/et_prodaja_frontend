import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../../../model/company';
import { Contact } from '../../../model/contact';
import { Offer } from '../../../model/offer';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { CompanyService } from '../../../services/company.service';
import { ContactService } from '../../../services/contact.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule, MatLabel, MatInput, CdkTextareaAutosize,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],  
  templateUrl: './offer-form.component.html',
  styleUrl: './offer-form.component.css'
})
export class OfferFormComponent implements OnInit {


  constructor(
    private companyService: CompanyService,
    private contactService: ContactService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.getFirstDayOfWeek = () => {return 1}
  }


  @Input()
  get offer(): Offer
  {
    return this.offerForm.value as Offer;
  }
  set offer(o: Offer | undefined)
  {
    this._offer = o;
    if (this._offer)
    {
      this.offerForm.patchValue(this._offer);
      this.contactService.getContacts(this._offer.company.id).subscribe(c => {
        this.contacts = c;
        if (this.contacts && this.contacts.length > 0)
        {
          this.offerForm.get("contact")?.enable();
          this.offerForm.get('contact')?.setValue(this.contacts.find(cnt => cnt.id == this.offer.contact.id));
        } else {
          this.offerForm.get("contact")?.disable();
        }
      })
    } else {
      this.offerForm.get('contact')?.disable();
    }
  }


  get offerFormIsValid(): boolean
  {
    if (this.offerForm.valid)
      return true;
    return false;
  }


  private _offer?: Offer;


  ngOnInit(): void {

    this.companies$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.companyService.searchCompanies(query, 5))
    );

  }


  offerForm = new FormGroup(
    {
      id: new FormControl<string>(''),
      validUntil: new FormControl<Date>((new Date(new Date().valueOf() + 7*24*60*60*1000)), [Validators.required]),
      company: new FormControl<Company | undefined>(undefined, [Validators.required]),
      contact: new FormControl<Contact | undefined>(undefined),
      vat: new FormControl<number>(17, [Validators.min(1), Validators.required]),
      notes: new FormControl<string>(`Cijene su u KM (BAM).
Plaćanje: po dogovoru.
Rok realizacije: po dogovoru.
Garantni period: 2 godine.`),
      comments: new FormControl<string>('')
    }
  )


  companies$!: Observable<Company[]>;

  contacts?: Contact[];


  private searchText$ = new Subject<string>();


  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  search(packageName: string) {
    this.searchText$.next(packageName);
  }


  companyToCompanyName(c: Company): string
  {
    
    if (c && c.name && c.locality)
      return `${c.name} - ${c.locality}`;

    return "";
  }


  companySelected($event: MatAutocompleteSelectedEvent): void
  {

    let c: Company = $event.option.value;

    if (c)
      this.contactService.getContacts(c.id).subscribe(cs => {
        this.contacts = cs;
        if (this.contacts && this.contacts.length > 0)
          this.offerForm.get('contact')?.enable();
        else
          this.offerForm.get('contact')?.disable();
      });

  }


}
