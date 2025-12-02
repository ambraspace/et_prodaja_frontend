import { Component } from '@angular/core';
import { FileDropDirective } from './file-drop.directive';
import { fakeAsync, TestBed } from '@angular/core/testing';

@Component({
    template: '<div [appFileDrop]="fileTypes" (filesDropped)="onFileDrop($event)">DROP FILE HERE!</div>',
    imports: [FileDropDirective]
})
class TestComponent {

  fileTypes: string[] = [
    "image/jpeg", "image/png"
  ];

  droppedFiles: File[] = [];

  onFileDrop($event: File[]): void
  {
    this.droppedFiles = $event;
  }

}

describe('FileDropDirective', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FileDropDirective, TestComponent]
    }).compileComponents();

  });


  it('should create an instance', () => {

    const fixture = TestBed.createComponent(TestComponent);

    const component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });


  it('should change style on dragover and dragleave', () => {

    const fixture = TestBed.createComponent(TestComponent);

    let el: HTMLElement = fixture.nativeElement;

    el = el.querySelector("div") as HTMLElement;

    expect(el).toBeDefined();

    expect(el.style.border).toBe("");

    el.dispatchEvent(new Event("dragover"));

    expect(el.style.border).toBe("1px solid red");

    el.dispatchEvent(new Event("dragleave"));

    expect(el.style.border).toBe("1px solid black");

  });


  it("should receive files on drop event", () => {

    const files: File[] = [
      new File(["ONE"], "image1.jpg", {type: "image/jpeg"}),
      new File(["TWO"], "image2.png", {type: "image/png"}),
    ];
  
    const dt: DataTransfer = new DataTransfer();
  
    dt.items.add(files[0]);
    dt.items.add(files[1]);
  
    const event: DragEvent = new DragEvent("drop", {dataTransfer: dt});
    
    const fixture = TestBed.createComponent(TestComponent);
  
    const comp = fixture.componentInstance;
  
    let el: HTMLElement = fixture.nativeElement;
  
    el = el.querySelector("div") as HTMLElement;

    fixture.detectChanges();
  
    el.dispatchEvent(new Event("dragover"));
  
    el.dispatchEvent(event);

    expect(comp.droppedFiles).toEqual(files);
  
  });

});

