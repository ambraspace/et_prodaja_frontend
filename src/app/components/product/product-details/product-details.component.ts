import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {


  constructor(
    private productService: ProductService
  ) {}


  ngOnInit(): void {
    this.loadProduct();
  }


  @Input()
  set id(id: number)
  {
    this.productId = id;
  }


  productId!: number;

  
  product?: Product


  loadProduct(): void
  {
    this.productService.getProduct(this.productId).subscribe(p => this.product = p);
  }


}
