import { Component, Inject, Input, OnInit } from '@angular/core';
import { Company } from '../../../model/company';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel} from '@angular/material/form-field'
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CompanyService } from '../../../services/company.service';
import { NgIf, NgFor } from '@angular/common';
import { WarehouseViewComponent } from '../../warehouse/warehouse-view/warehouse-view.component';
import { ContactViewComponent } from '../../contact/contact-view/contact-view.component';

@Component({
    selector: 'app-company-detail',
    imports: [MatDialogContent, MatFormField, MatLabel, MatDialogActions,
        MatDialogClose, FormsModule, MatInput, MatButton, NgIf, NgFor, WarehouseViewComponent, ContactViewComponent],
    templateUrl: './company-detail.component.html',
    styleUrl: './company-detail.component.css'
})
export class CompanyDetailComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
  ) {}

  @Input()
  set id(id: number)
  {
    this.companyId = id;
  }

  ngOnInit(): void {
    this.loadCompany();
  }

  companyId: number | undefined;

  company: Company | null = null;

  formFieldName: string = "";
  formFieldLocality: string = ""

  get dirty(): boolean
  {
    if (this.company)
    {
      if (this.company.name === this.formFieldName && this.company.locality === this.formFieldLocality)
        return false;
      else
        return true;
    } else {
      return false;
    }
  }


  loadCompany(): void
  {
    if (this.companyId)
    {
      this.companyService.getCompany(this.companyId).subscribe(c => {
        this.company = c;
        this.formFieldName = c.name;
        this.formFieldLocality = c.locality;
      });
    }
  }


  saveCompany(): void
  {
    if (this.company && this.dirty)
    {
      this.companyService.updateCompany(this.company.id, {
        id: this.company.id,
        name: this.formFieldName,
        locality: this.formFieldLocality
      }).subscribe(c => {this.company = c})  
    }
  }

}
