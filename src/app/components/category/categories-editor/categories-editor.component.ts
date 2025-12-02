import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../model/category';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FlatTreeCategory } from '../../../model/flat-tree-category';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TextInputDialog } from '../../dialogs/text-input-dialog/text-input-dialog.component';
import { HasUnsaavedChanges } from '../../../model/has-unsaaved-changes';

@Component({
    selector: 'app-categories-editor',
    imports: [
        NgIf,
        MatTreeModule,
        MatButtonModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    templateUrl: './categories-editor.component.html',
    styleUrl: './categories-editor.component.css'
})
export class CategoriesEditorComponent implements OnInit, HasUnsaavedChanges {
  
  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  
  categories: Category[] = [];
  
  private nextId: number = -1;

  dirty: boolean = false;

  hasUnsavedChanges(): boolean {
    return this.dirty;
  }
  
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void
  {
    this.categoryService.getCategories().subscribe(cs => {
      this.categories = cs;
      this.reloadTreeData();
    })
  }
  
  reloadTreeData()
  {
    let expandedMap = new Map<number, boolean>();
    if (this.treeControl.dataNodes)
    {
      this.treeControl.dataNodes.forEach(ftn => {
        expandedMap.set(ftn.category.id, this.treeControl.isExpanded(ftn));
      });
    }
    this.dataSource.data = this.categories;
    this.treeControl.dataNodes.forEach(ftn => {
      let state = expandedMap.get(ftn.category.id);
      if (state)
        this.treeControl.expand(ftn); 
    });
  }
  
  private _transformer = (node: Category, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      category: node
    };
  };
  
  treeControl = new FlatTreeControl<FlatTreeCategory>(
    node => node.level,
    node => node.expandable,
  );
  
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  hasChild = (_: number, node: FlatTreeCategory) => node.expandable;
  
  
  isFirstOfSiblings(categoryId: number): boolean
  {
    let sib = this.getSiblings(categoryId, this.categories);
    if (sib.length > 0 && sib[0].id == categoryId)
      return true;
    return false;
  }
  
  
  isLastOfSiblings(categoryId: number): boolean
  {
    let sib = this.getSiblings(categoryId, this.categories);
    if (sib.length > 0 && sib[sib.length - 1].id == categoryId)
      return true;
    return false;
  }
  
  
  private getSiblings(categoryId: number, array: Category[]): Category[]
  {
    if (array && array.length > 0)
      {
      for (let index = 0; index < array.length; index++) {
        const cat = array[index];
        if (cat.id == categoryId)
          return array;
        let sib = this.getSiblings(categoryId, cat.children!);
        if (sib.length > 0) return sib;
      }
    }
    return [];
  }
  
  
  moveUp(categoryId: number)
  {
    this.internalMoveUp(categoryId, this.categories);
    this.reloadTreeData();
    this.dirty = true;
  }
  
  
  moveDown(categoryId: number)
  {
    this.internalMoveDown(categoryId, this.categories);
    this.reloadTreeData();
    this.dirty = true;
  }
  
  
  private internalMoveUp(categoryId: number, array: Category[]): boolean
  {
    for (let index = 0; index < array.length; index++) {
      const category = array[index];
      if (category.id == categoryId)
        {
        let cat = array.splice(index, 1);
        array.splice(index - 1, 0, cat[0]);
        return true;
      } else {
        let moved = this.internalMoveUp(categoryId, category.children!);
        if (moved)
          return true;
      }
    }
    return false;
  }
  
  
  private internalMoveDown(categoryId: number, array: Category[])
  {
    for (let index = 0; index < array.length; index++) {
      const category = array[index];
      if (category.id == categoryId)
        {
        let cat = array.splice(index + 1, 1);
        array.splice(index, 0, cat[0]);
        return true;
      } else {
        let moved = this.internalMoveDown(categoryId, category.children!);
        if (moved)
          return true;
      }
    }
    return false;
  }
  
  
  drop(categoryId: number)
  {
    this.internalDrop(categoryId, this.categories);
    this.reloadTreeData();
    this.dirty = true;
  }
  
  
  private internalDrop(categoryId: number, array: Category[]): boolean
  {
    for (let index = 0; index < array.length; index++) {
      const category = array[index];
      if (category.id == categoryId)
        {
        array.splice(index, 1);
        return true;
      } else {
        let dropped = this.internalDrop(categoryId, category.children!);
        if (dropped)
          return true;
      }
    }
    return false;
  }
  
  
  updateCategories(): void
  {
    this.categoryService.saveCategories(this.categories).subscribe(cat => {
      this.categories = cat;
      this.reloadTreeData();
      this.snackBar.open("Kategorije su sačuvane.",undefined, {duration: 3000})
      this.dirty = false;
      this.nextId = -1;
    })
  }
  
  
  addMainCategory(): void
  {
    
    let dialogRef = this.dialog.open<TextInputDialog, {placeholder: string, defaultValue: string, allowEmpty: boolean, multiline: boolean}, string>(
      TextInputDialog, {data: {placeholder: "Naziv nove kategorije", defaultValue: "", allowEmpty: false, multiline: false}}
    );
    
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        {
        this.categories.push({
          id: this.nextId--,
          name: result,
          children: []
        });
        this.reloadTreeData();
        this.dirty = true;
      }
    });
    
  }
  
  
  editCategoryName(categoryId: number)
  {
    let category = this.findCategory(categoryId, this.categories);
    if (category)
      {
      let dialogRef = this.dialog.open<TextInputDialog, {placeholder: string, defaultValue: string, allowEmpty: boolean, multiline: boolean}, string>(
        TextInputDialog, {data: {placeholder: "Novi naziv kategorije", defaultValue: category.name, allowEmpty: false, multiline: false}});
      dialogRef.afterClosed().subscribe(result => {
        if (result && category.name != result)
        {
          category.name = result;
          this.reloadTreeData();
          this.dirty = true;
        }
      });
    }
  }
  
  
  findCategory(categoryId: number, array: Category[]): Category | null
  {
    
    for (let index = 0; index < array.length; index++) {
      const cat = array[index];
      if (cat.id == categoryId)
        return cat;
      let c = this.findCategory(categoryId, cat.children!);
      if (c)
        return c;
    }
    
    return null;
    
  }
  
  
  addNewSubcategory(categoryId: number): void
  {
    let category = this.findCategory(categoryId, this.categories);
    if (category)
      {
      let dialogRef = this.dialog.open<TextInputDialog, {placeholder: string, defaultValue: string, allowEmpty: boolean, multiline: boolean}, string>(
        TextInputDialog, {data: {placeholder: "Naziv podkategorije", defaultValue: "", allowEmpty: false, multiline: false}});
      dialogRef.afterClosed().subscribe(result => {
        if (result)
          {
          category.children!.push(
            {
              id: this.nextId--,
              name: result,
              children: []
            }
          )
          this.reloadTreeData();
          this.dirty = true;
        }
      });
    }
  }
  
  
}
