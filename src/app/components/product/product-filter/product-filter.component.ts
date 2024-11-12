import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
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
import { ProductFilter } from '../../../model/product-filter';
import { AuthService } from '../../../services/auth.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

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
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent implements OnInit {


  constructor(
    private warehouseService: WarehouseService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: {filter: ProductFilter, callBack: ((filter: ProductFilter) => void) | undefined}
  ) {
    this.productFilter = new ProductFilter();
    if (data.filter)
    {
      this.productFilter = new ProductFilter();
      this.productFilter.query = data.filter.query;
      this.productFilter.searchComments = data.filter.searchComments;
      this.productFilter.warehouseId = data.filter.warehouseId;
      this.productFilter.tags = data.filter.tags;
      this.productFilter.categoryId = data.filter.categoryId;
    }
    if (data.callBack)
    {
      this.callBack = data.callBack;
    }
  }
  

  productFilter: ProductFilter;


  private callBack?: (filter: ProductFilter) => void;


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
    if (this.productFilter.query && this.productFilter.query.trim().length > 0)
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
    if (this.productFilter.warehouseId != undefined)
    {
      this.loadWarehouse();
    }
  }


  loadWarehouse(): void
  {
    this.warehouseService.getWarehouseById(this.productFilter.warehouseId!).subscribe(w => {
      this.selectedWarehouse = w;
    })
  }


  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;


  loadCategories(): void
  {
    this.categoryService.getCategories().subscribe(cs => {
      this.flatCategories = this.treeFlattener.flattenNodes(cs);
      this.selectedCategory = this.flatCategories.find(ftc => ftc.category.id == this.productFilter.categoryId);
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
    if (this.selectedWarehouse)
      this.productFilter.warehouseId = this.selectedWarehouse.id;
    else
      this.productFilter.warehouseId = undefined;
    if (this.selectedCategory)
      this.productFilter.categoryId = this.selectedCategory.category.id;
    else
      this.productFilter.categoryId = undefined;
    if (this.callBack)
    {
      this.callBack(this.productFilter);
    }
  }


  cancelFilter(): void
  {
    this.productFilter = new ProductFilter();
    this.selectedCategory = undefined;
    this.selectedWarehouse = undefined;
    this.applyFilter();
  }


  selectedTag($event: MatAutocompleteSelectedEvent): void
  {
    const index = this.productFilter.tags?.indexOf($event.option.value.name);

    if (index === -1) {
      this.productFilter.tags!.push($event.option.value.name);
    }

    this.tagInput!.nativeElement.value = '';
  }


  removeTag(tag: string): void
  {

    const index = this.productFilter.tags?.indexOf(tag);

    if (index != undefined && index >= 0) {
      this.productFilter.tags!.splice(index, 1);
    }

  }

  onEnterPressed($event: KeyboardEvent): void
  {
    if ($event.key == 'Enter')
    {
      this.applyFilter();
    }
  }

  isAuthenticated(): boolean
  {
    if (this.auth.getToken() != undefined)
      return true;
    return false;
  }


}
