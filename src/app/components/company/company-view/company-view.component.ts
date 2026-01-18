import { Component, OnInit } from '@angular/core';

import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../model/company';
import { Page } from '../../../model/page';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator'
import { Router, RouterLink } from '@angular/router';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';
import { AddCompanyDialogComponent } from '../add-company-dialog/add-company-dialog.component';

@Component({
    selector: 'app-company-view',
    imports: [MatTableModule, RouterLink, MatButtonModule, MatDialogModule, MatPaginator],
    templateUrl: './company-view.component.html',
    styleUrl: './company-view.component.css'
})
export class CompanyViewComponent implements OnInit{

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  companies: Page<Company> | null = null;

  get dataSource(): Company[]
  {
    if (this.companies)
      return this.companies.content;
    else
      return []
  }

  displayedColumns: string[] = ['name', 'locality', 'actions'];


  ngOnInit(): void {
    this.loadCompanies();
  }


  loadCompanies(): void
  {
      this.companyService.getCompanies().subscribe(page => this.companies = page);
  }

  deleteCompany(companyId: number): void
  {

    let company = this.companies?.content.find(c => c.id == companyId);

    if (company)
    {
      let dialogRef = this.dialog.open(YesNoDialogComponent, {data: "Da li sigurno želite obrisati kompaniju: " + company.name });

      dialogRef.afterClosed().subscribe((result: string) => {
        if (result === "YES")
        {
          this.companyService.deleteCompany(companyId).subscribe(() => {
            if (this.companies?.content.length === 1 && this.companyService.page > 0)
              this.companyService.page--;
            this.loadCompanies();
          })
        }
      })  

    }

  }

  
  addCompany(): void
  {

    let dialogRef = this.dialog.open(AddCompanyDialogComponent, {data: {id: 0, name: "", locality: ""}});

    dialogRef.afterClosed().subscribe((result: Company) => {
      if (result)
      {
        this.companyService.addCompany({id: 0, name: result.name, locality: result.locality}).subscribe((c)=>{
          this.router.navigateByUrl(`/companies/${c.id}`)
        })
      }
    })  

  }

  updateTable(event: any): void
  {
    this.companyService.page = event.pageIndex;
    this.companyService.size = event.pageSize;
    this.loadCompanies();
  }
  
}


