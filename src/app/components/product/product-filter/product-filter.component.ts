import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Warehouse } from '../../../model/warehouse';
import { WarehouseService } from '../../../services/warehouse.service';
import { Tag } from '../../../model/tag';
import { TagService } from '../../../services/tag.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../model/category';
import { FlatTreeCategory } from '../../../model/flat-tree-category';
import { MatTreeFlattener } from '@angular/material/tree';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    MatFormField, MatLabel, MatInput, MatCheckbox,
    MatButtonModule,
    MatChipsModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatSelectModule
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      query: string,
      searchComments: boolean,
      warehouseId: number,
      tags: string[],
      categoryId: number
    },
    private dialogRef: MatDialogRef<ProductFilterComponent>,
    private warehouseService: WarehouseService,
    private tagService: TagService,
    private categoryService: CategoryService
  ) {
    this.query = data.query;
    this.searchComments = data.searchComments && this.queryIsNotEmpty();
    this.warehouseId = data.warehouseId;
    if (this.warehouseId)
    {
      warehouseService.getWarehouseById(this.warehouseId).subscribe(w => this.selectedWarehouse = w);
    }
    this.tags = [];
    if (data.tags && data.tags.length > 0)
    {
      data.tags.forEach(t => this.tags!.push(t))
    }
    this.categoryId = data.categoryId;
  }


  query?: string;
  searchComments?: boolean;
  warehouseId?: number;
  tags?: string[]
  categoryId?: number


  flatCategories: FlatTreeCategory[] = [];


  readonly separatorKeysCodes = [ENTER] as const;

  addOnBlur = false;

  warehouseSearchResult$!: Observable<Warehouse[]>;

  tagSearchResult$!: Observable<Tag[]>;

  private warehouseSearchText$ = new Subject<string>();

  private tagSearchText$ = new Subject<string>();

  selectedWarehouse?: Warehouse;

  selectedCategory?: FlatTreeCategory;


  queryIsNotEmpty(): boolean
  {
    if (this.query && this.query.trim().length > 0)
      return true;
    return false;
  }


  ngOnInit(): void {
    this.warehouseSearchResult$ = this.warehouseSearchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.warehouseService.searchWarehouse(query, 5))
    );
    this.tagSearchResult$ = this.tagSearchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.tagService.searchTags(query))
    );
    this.loadCategories();
  }


  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;


  loadCategories(): void
  {
    this.categoryService.getCategories().subscribe(cs => {
      this.flatCategories = this.treeFlattener.flattenNodes(cs);
      this.selectedCategory = this.flatCategories.find(ftc => ftc.category.id == this.categoryId)
      // if (cs.length > 0)
      //   this.productForm.get('category')?.patchValue(this.flatCategories[0].category)
    })
  }


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


  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  searchTags(packageName: string) {
    this.tagSearchText$.next(packageName);
  }


  searchWarehouses(packageName: string) {
    this.warehouseSearchText$.next(packageName);
  }


  warehouseToWarehouseName(w: Warehouse): string
  {
    if (w)
      return `${w.name} (${w.company.name} - ${w.company.locality})`;
    return "";
  }

  
  tagToTagName = (tag: Tag) => tag.name;


  applyFilter():void
  {
    this.dialogRef.close({
      query: (this.query || '').trim(),
      searchComments: this.searchComments,
      warehouseId: this.selectedWarehouse?.id,
      tags: this.tags,
      categoryId: this.selectedCategory?.category.id
    })
  }


  cancel(): void
  {
    this.dialogRef.close();
  }


  selectedTag($event: MatAutocompleteSelectedEvent): void
  {
    const index = this.tags!.indexOf($event.option.value.name);

    if (index === -1) {
      this.tags!.push($event.option.value.name);
    }

    this.tagInput!.nativeElement.value = '';
  }


  removeTag(tag: string): void
  {
    const index = this.tags!.indexOf(tag);

    if (index >= 0) {
      this.tags!.splice(index, 1);
    }

  }


}
