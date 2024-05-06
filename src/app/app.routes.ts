import { ResolveFn, Routes } from '@angular/router';
import { CompanyViewComponent } from './company/company-view/company-view.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { LoginComponent } from './login/login.component';
import { loginGuard } from './login.guard';

const resolvedChildATitle: ResolveFn<string> = (id) => Promise.resolve('Company ID: ' + id.paramMap.get("id"));

export const routes: Routes = [
    {path: "login", component: LoginComponent, title: "Log in"},
    {path: "companies/:id", component: CompanyDetailComponent, title: resolvedChildATitle, canActivate: [loginGuard]},
    {path: "companies", component: CompanyViewComponent, title: "All companies", canActivate: [loginGuard]},
    {path: "", redirectTo: "/companies", pathMatch: 'full'}
];
