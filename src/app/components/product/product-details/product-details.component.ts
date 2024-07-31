import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { Product } from "../../../model/product";
import { ProductService } from "../../../services/product.service";
import { ProductFormComponent } from "../product-form/product-form.component";
import { StockInfoComponent } from "../../stock-info/stock-info/stock-info.component";
import { ToEuroPipe } from "../../../pipes/to-euro.pipe";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { YesNoDialogComponent } from "../../dialogs/yes-no-dialog/yes-no-dialog.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    ProductFormComponent,
    StockInfoComponent,
    MatButtonModule,
    ToEuroPipe, CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  @Input()
  set id(id: number)
  {
    this.productId = id;
  }


  productId!: number;

  
  product?: Product


  @ViewChild('productForm') productFormComponent: ProductFormComponent | undefined;


  ngOnInit(): void {
    this.loadProduct();
  }


  loadProduct(): void
  {
    this.productService.getProduct(this.productId).subscribe(p => {
      this.product = p;
    })
  }


  updateProduct(): void
  {
    this.productService.updateProduct(this.productId, this.productFormComponent!.product)
      .subscribe(p => this.router.navigateByUrl("/products"))
  }


  deleteProduct(): void
  {

    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: "Želite li obrisati ovaj proizvod?"})

    dialogRef.afterClosed().subscribe(res => {
      if (res)
      {
        this.productService.deleteProduct(this.productId)
        .subscribe(() => {
          this.router.navigateByUrl("/products");
        })
      }
    })

  }

}
