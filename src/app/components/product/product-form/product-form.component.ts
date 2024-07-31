import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../model/category';
import { MatTreeFlattener } from '@angular/material/tree';
import { MatChipInputEvent, MatChipRow, MatChipsModule } from '@angular/material/chips';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Tag } from '../../../model/tag';
import { MatButtonModule } from '@angular/material/button';
import { ENTER } from '@angular/cdk/keycodes';
import { TagService } from '../../../services/tag.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PreviewService } from '../../../services/preview.service';
import { Preview } from '../../../model/preview';
import { FileDropDirective } from '../../../file-drop.directive';
import { HttpEventType } from '@angular/common/http';
import { FlatTreeCategory } from '../../../model/flat-tree-category';
import { Product } from '../../../model/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatSelect, MatOption,
    MatProgressBar,
    MatChipsModule, MatChipRow,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
    FileDropDirective
],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {


  @Input()
  get product(): Product
  {
    if (this.previews.length > 0)
    {
      for (let i=0; i<this.previews.length; i++)
      {
        let p: Preview = this.previews.at(i).value;
        p.primary = false;
        this.previews.at(i).patchValue(p);
      }
      let p: Preview = this.previews.at(this.previewIndex).value;
      p.primary = true;
      this.previews.at(this.previewIndex).patchValue(p);
    }
    return this.productForm.value as Product;
  }
  set product(p: Product | undefined)
  {
    this._product = p;

    if (this._product)
    {

      this.productForm.patchValue(this._product);
      this._product.tags.forEach(t => this.tags.push(new FormControl(t)));
      this._product.previews.forEach(p => this.previews.push(new FormControl(p)));

      if (this.flatCategories.length > 0)
      {
        let cat = this.flatCategories.find(fc => fc.category.id == this._product?.category.id)?.category;
        if (cat) this.productForm.get('category')?.patchValue(cat);
      }

      if (this._product.previews.length > 0)
      {
        this.previewIndex = this._product.previews.findIndex(p => p.primary == true);
        if (this.previewIndex == -1) this.previewIndex = 0;  
      }

    }
  }


  _product?: Product


  get valid(): boolean
  {
    return this.productForm.valid;
  }
  
  get dirty(): boolean
  {
    return this.productForm.dirty;
  }
  

  constructor(
    private previewService: PreviewService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) {

  }


  flatCategories: FlatTreeCategory[] = [];


  addOnBlur = false;


  readonly separatorKeysCodes = [ENTER] as const;


  units: string[] = [
    "kom.", "kpl.", "m", "m²", "n.č.", "pauš."
  ];


  tagSearchResult$!: Observable<Tag[]>;


  private searchText$ = new Subject<string>();


  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  search(packageName: string) {
    this.searchText$.next(packageName);
  }
  

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;



  private _transformer = (node: Category, level: number) => {
    return {
      expandable: node.children && node.children.length > 0 ? true : false,
      name: "-".repeat(level) + " " + node.name,
      level: level,
      category: node
    } as FlatTreeCategory;
  };
  
  
  treeFlattener = new MatTreeFlattener<Category, FlatTreeCategory>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );


  uploadProgress: number = 100;


  productForm = new FormGroup({
    id: new FormControl<number>(0),
    name: new FormControl<string>('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    previews: new FormArray<FormControl<Preview>>([]),
    unit: new FormControl<string>('', [Validators.required]),
    price: new FormControl<number>(0, [Validators.required, Validators.pattern('[0-9]+(.[0-9]+)?'), Validators.min(0.01)]),
    category: new FormControl<Category>({} as Category, [Validators.required]),
    tags: new FormArray<FormControl<Tag>>([]),
    comment: new FormControl<string>('')
  });


  previewIndex = 0;


  allowedFileTypes: string[] = [
    "image/jpeg", "image/png"
  ]


  ngOnInit(): void {

    this.tagSearchResult$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.tagService.searchTags(query))
    );

    this.loadCategories();

  }


  loadCategories(): void
  {
    this.categoryService.getCategories().subscribe(cs => {
      this.flatCategories = this.treeFlattener.flattenNodes(cs);
      if (this.flatCategories.length > 0)
      {
        
        if (this._product && this._product.category)
        {
          let cat = this.flatCategories.find(fc => fc.category.id == this._product!.category!.id)!.category;
          console.log(cat);

          this.productForm.get('category')?.patchValue(cat);
        } 
        else {
          this.productForm.get('category')?.patchValue(this.flatCategories[0].category)
        }
      }
    })
  }


  get tags(): FormArray {
    return this.productForm.get('tags') as FormArray;
  }


  get previews(): FormArray
  {
    return this.productForm.get('previews') as FormArray
  }


  fileNameAt(index: number): string
  {
    return (this.previews.at(index).value as Preview).fileName;
  }


  tagToTagName = (tag: Tag) => tag.name;


  selectedTag(event: MatAutocompleteSelectedEvent): void {
    let tag: Tag = event.option.value;
    let pos = -1;
    if (this.tags.length > 0)
    {
      pos = this.tags.controls.findIndex(c => c.value.name == tag.name);
    }
    if (pos === -1)
    {
      this.tags.push(new FormControl(tag));
      this.productForm.markAsDirty();
    }
    this.tagInput!.nativeElement.value = '';
    event.option.deselect();
  }


  addTag(event: MatChipInputEvent): void {

    const value = (event.value || '').trim();

    if (value) {    
      let tag: Tag = {
        name: value,
        color: '#000000'
      }
      this.tagService.addTag(tag).subscribe(t => {
        let pos = -1;
        if (this.tags.length > 0)
        {
          pos = this.tags.controls.findIndex(c => c.value.name == t.name);
        }
        if (pos === -1)
        {
            this.tags.push(new FormControl(t));
            this.productForm.markAsDirty();
        }
        event.chipInput!.clear();
      });
    }

  }


  removeTag(tag: Tag): void {

    const index = this.tags.controls.findIndex(c => c.value.name == tag.name);

    if (index >= 0) {
      this.tags.removeAt(index);
      this.productForm.markAsDirty();
    }
  }


  filesSelected(event: any): void
  {
    let fileList: FileList = event.target.files;
    let files: File[] = [];
    for (let index = 0; index < fileList.length; index++) {
      let element = fileList.item(index);
      if (element?.type && this.allowedFileTypes.includes(element?.type))
      {
        files.push(element);
      }
    }
    if (files.length > 0)
    {
      this.uploadFiles(files);
    }
  }


  onFileDrop(event: File[]): void
  {
    this.uploadFiles(event);
  }


  uploadFiles(files: File[]): void
  {
    this.previewService.uploadFiles(files).subscribe(event => {
      if (event.type == HttpEventType.UploadProgress)
      {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total!));
      } else if (event.type == HttpEventType.Response)
      {
        event.body?.forEach(pr => this.previews.push(new FormControl(pr)))
        this.uploadProgress = 100;
      }
      this.productForm.markAsDirty();
    })
  }


  moveLeft(): void
  {
    if (this.previewIndex < 1)
    {
      this.previewIndex = (this.previews.length - 1)
    } else {
      this.previewIndex--;
    }
    this.productForm.markAsDirty();
  }


  moveRight(): void
  {     
    if (this.previewIndex > (this.previews.length - 2))
    {
      this.previewIndex = 0;
    } else {
      this.previewIndex++;
    }
    this.productForm.markAsDirty();
  }


  removePreview(): void
  {
    this.previews.removeAt(this.previewIndex);
    this.productForm.markAsDirty();
    if (this.previewIndex > (this.previews.length - 1))
      this.previewIndex--;
  }


  onlyNumbersAndComma(event: KeyboardEvent): boolean
  {
    if (
      event.key == '0' ||
      event.key == '1' ||
      event.key == '2' ||
      event.key == '3' ||
      event.key == '4' ||
      event.key == '5' ||
      event.key == '6' ||
      event.key == '7' ||
      event.key == '8' ||
      event.key == '9' ||
      event.key == ',' ||
      event.key == '.'
    ) return true;
    return false;
  }


  setUnit(event: MatAutocompleteSelectedEvent): void
  {
    this.productForm.get('unit')?.setValue(event.option.viewValue);
  }


}
