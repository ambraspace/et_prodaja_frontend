import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductFormComponent } from "../product-form/product-form.component";
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';

@Component({
    selector: 'app-add-product',
    imports: [
        MatButtonModule,
        ProductFormComponent
    ],
    templateUrl: './add-product.component.html',
    styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  constructor(
    private dialogRef: MatDialogRef<AddProductComponent>,
    private productService: ProductService
  )  {}


  @ViewChild('productForm') productFormComponent: ProductFormComponent | undefined;

  
  closeDialog()
  {
    this.dialogRef.close();
  }


  saveProduct()
  {

    if (this.productFormComponent?.valid)
    {
      let product: Product = this.productFormComponent.product;
      product.category.children = [];
      product.price = Number.parseFloat(("" + product.price).replace(",", "."));
      this.productService.addProduct(product).subscribe(p => {
        this.dialogRef.close(p.id);
      })
    } else {
      alert("Provjerite unesene podatke!")
    }

  }


}


