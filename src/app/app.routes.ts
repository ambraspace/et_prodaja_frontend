import { Routes } from '@angular/router';
import { CompanyDetailComponent } from './components/company/company-detail/company-detail.component';
import { CompanyViewComponent } from './components/company/company-view/company-view.component';
import { DeliveryDetailsComponent } from './components/delivery/delivery-details/delivery-details.component';
import { DeliveryViewComponent } from './components/delivery/delivery-view/delivery-view.component';
import { LoginComponent } from './components/login/login.component';
import { OfferDetailsComponent } from './components/offer/offer-details/offer-details.component';
import { OfferViewComponent } from './components/offer/offer-view/offer-view.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { OrderViewComponent } from './components/order/order-view/order-view.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { ProductViewComponent } from './components/product/product-view/product-view.component';
import { UserViewComponent } from './components/user/user-view/user-view.component';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';
import { CategoriesEditorComponent } from './components/category/categories-editor/categories-editor.component';
import { pendingChangesGuard } from './guards/pending-changes.guard';
import { ProductSelectorComponent } from './components/offer/product-selector/product-selector.component';
import { CatalogComponent } from './components/product/catalog/catalog.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent, title: "Prijava"},
    {path: "users", component: UserViewComponent, title: "Korisnici", canActivate: [adminGuard, loginGuard]},
    {path: "companies/:id", component: CompanyDetailComponent, title: "Detalji kompanije", canActivate: [loginGuard]},
    {path: "companies", component: CompanyViewComponent, title: "Kompanije", canActivate: [loginGuard]},
    {path: "products/:id", component: ProductDetailsComponent, title: "Detalji proizvoda", canActivate: [loginGuard], canDeactivate: [pendingChangesGuard]},
    {path: "products", component: ProductViewComponent, title: "Proizvodi", canActivate: [loginGuard]},
    {path: "catalog", component: CatalogComponent, title: "Katalog"},
    {path: "categories", component: CategoriesEditorComponent, title: "Kategorije proizvoda", canActivate: [loginGuard], canDeactivate: [pendingChangesGuard]},
    {path: "offers/:id/productSelector", component: ProductSelectorComponent, title: "Izbor proizvoda", canActivate: [loginGuard]},
    {path: "offers/:id", component: OfferDetailsComponent, title: "Detalji ponude", canActivate: [loginGuard]},
    {path: "offers", component: OfferViewComponent, title: "Ponude", canActivate: [loginGuard]},
    {path: "orders/:id", component: OrderDetailsComponent, title: "Detalji narudžbe", canActivate: [loginGuard]},
    {path: "orders", component: OrderViewComponent, title: "Narudžbe", canActivate: [loginGuard]},
    {path: "deliveries/:id", component: DeliveryDetailsComponent, title: "Detalji isporuke", canActivate: [loginGuard]},
    {path: "deliveries", component: DeliveryViewComponent, title: "Isporuke", canActivate: [loginGuard]},
    {path: "", redirectTo: "/products", pathMatch: 'full'},
    {path: "**", component: PageNotFoundComponent, title: "404 - Stranica nije pronađena!"},
];
