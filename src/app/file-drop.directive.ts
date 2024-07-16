import { Directive, HostListener, Input, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
  standalone: true
})
export class FileDropDirective {

  constructor(private el: ElementRef) {}


  @Input()
  appFileDrop: string[] = [];


  @HostListener("dragover", ['$event'])
  onDragOver(event: DragEvent)
  {
    event.stopPropagation();
    event.preventDefault();
    this.el.nativeElement.style.border = "1px solid red";
  }



  @HostListener("dragleave", ['$event'])
  onDragLeave(event: DragEvent)
  {
    event.stopPropagation();
    event.preventDefault();
    this.el.nativeElement.style.border = "1px solid black";
  }



  @HostListener("drop", ['$event'])
  public onDrop($event: DragEvent)
  {

    $event.stopPropagation();
    $event.preventDefault();

    this.el.nativeElement.style.border = "1px solid black"

    if ($event.dataTransfer?.files.length && $event.dataTransfer?.files.length > 0)
    {
      let validFiles: File[] = [];
      for (let index = 0; index < $event.dataTransfer?.files.length; index++) {
        let element = $event.dataTransfer?.files.item(index);
        if (element?.type && this.appFileDrop.includes(element?.type))
        {
          validFiles.push(element);
        }
      }
      if (validFiles.length > 0)
      {
        this.filesDropped.emit(validFiles);
      }
    }
  }

  @Output() public filesDropped: EventEmitter<File[]> = new EventEmitter();
  

}
