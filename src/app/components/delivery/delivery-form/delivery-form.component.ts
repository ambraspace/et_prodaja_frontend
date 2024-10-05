import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../../../model/company';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { CompanyService } from '../../../services/company.service';
import { Delivery } from '../../../model/delivery';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-delivery-form',
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
  templateUrl: './delivery-form.component.html',
  styleUrl: './delivery-form.component.css'
})
export class DeliveryFormComponent implements OnInit {


  constructor(
    private companyService: CompanyService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.getFirstDayOfWeek = () => {return 1}
  }


  @Input()
  get delivery(): Delivery
  {
    return this.deliveryForm.value as Delivery;
  }
  set delivery(d: Delivery | undefined)
  {
    this._delivery = d;
    if (this._delivery)
    {
      this.deliveryForm.patchValue(this._delivery);
    }
  }


  get deliveryFormIsValid(): boolean
  {
    if (this.deliveryForm.valid)
      return true;
    return false;
  }


  private _delivery?: Delivery;


  ngOnInit(): void {

    this.companies$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.companyService.searchCompanies(query, 5))
    );

  }


  deliveryForm = new FormGroup({
    supplier: new FormControl<Company | undefined>(undefined),
    supplierReference: new FormControl<string>(''),
    comment: new FormControl<string>(''),
    deliveryDate: new FormControl<Date | undefined>(undefined)
  });


  companies$!: Observable<Company[]>;


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


}
