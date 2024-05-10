import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../model/company';
import { Page } from '../../../model/page';

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [NgFor],
  templateUrl: './company-view.component.html',
  styleUrl: './company-view.component.css'
})
export class CompanyViewComponent implements OnInit{

  constructor(
    private companyService: CompanyService,
  ) {}
  
  companies: Page<Company> | null = null;
  

  ngOnInit(): void {
    this.loadCompanies();
  }


  loadCompanies(): void
  {
      this.companyService.getCompanies().subscribe(page => this.companies = page);
  }


}
