import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { Item } from '../../../model/item';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ProductService } from '../../../services/product.service';
import { Preview } from '../../../model/preview';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-item-editor',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatFormField, MatLabel, MatInput,
        MatCheckboxModule,
        ReactiveFormsModule,
        CdkTextareaAutosize
    ],
    templateUrl: './item-editor.component.html',
    styleUrl: './item-editor.component.css'
})
export class ItemEditorComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ItemEditorComponent, {item: Item, applyDiscountToNext: boolean}>,
    @Inject(MAT_DIALOG_DATA) private data: {item: Item},
    private productService: ProductService
  ) {
    if (data.item)
    {
      this.item = data.item;
      this.itemForm.patchValue(this.item);
    }
  }


  item?: Item;


  previews: Preview[] = [];


  selectedPreview: number = 0;


  itemForm = new FormGroup({
    preview: new FormControl<string>(''),
    productName: new FormControl<string>(''),
    quantity: new FormControl<number>(0),
    grossPrice: new FormControl<number>(0),
    discountPercent: new FormControl<number>(0),
    applyDiscountToNext: new FormControl<boolean>(false)
  })

   
  ngOnInit(): void {
    this.loadPreviews();    
  }


  loadPreviews(): void
  {
    if (this.item && this.item.stockInfo && this.item.stockInfo.product && this.item.stockInfo.product.id)
    {
      this.productService.getProduct(this.item.stockInfo.product.id).subscribe(p => {
        this.previews = p.previews;
        this.selectedPreview = this.previews.findIndex(p => p.fileName == this.item?.preview);
        if (this.selectedPreview == -1)
        {
          this.selectedPreview = 0;
        }
      })
    }
  }


  getImage(): string
  {
    let preview = this.itemForm.get('preview')?.value;
    if (preview && preview.trim() != "")
    {
      return `/api/images/${preview}`;
    } else {
      return '/assets/no-image.jpg';
    }
  }


  leftPreview(): void
  {
    this.selectedPreview--;
    if (this.selectedPreview < 0)
      this.selectedPreview = this.previews.length - 1;
    this.itemForm.get('preview')?.patchValue(this.previews[this.selectedPreview].fileName)
  }


  rightPreview(): void
  {
    this.selectedPreview++;
    if (this.selectedPreview >= this.previews.length)
      this.selectedPreview = 0;
    this.itemForm.get('preview')?.patchValue(this.previews[this.selectedPreview].fileName)
  }


  removePreview(): void
  {
    this.itemForm.get('preview')?.setValue('');
    this.selectedPreview = 0;
  }


  closeDialog(): void
  {
    this.dialogRef.close()
  }


  saveItem(): void
  {
    this.item!.preview = this.itemForm.get('preview')!.value || '';
    this.item!.productName = this.itemForm.get('productName')!.value || "";
    this.item!.quantity = this.itemForm.get('quantity')!.value || 0;
    this.item!.grossPrice = this.itemForm.get('grossPrice')!.value || 0;
    this.item!.discountPercent = this.itemForm.get('discountPercent')!.value || 0;
    this.dialogRef.close({item: this.item!, applyDiscountToNext: this.itemForm.get('applyDiscountToNext')!.value!})
  }
}
