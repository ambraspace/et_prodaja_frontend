import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.css'
})
export class CompanyDetailComponent {

  companyId: number | undefined;

  @Input()
  set id(id: number)
  {
    this.companyId = id;
  }

  
}
