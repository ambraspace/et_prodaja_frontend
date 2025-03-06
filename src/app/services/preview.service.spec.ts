import { TestBed } from '@angular/core/testing';

import { PreviewService } from './preview.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEventType } from '@angular/common/http';
import { Preview } from '../model/preview';

describe('PreviewService', () => {

  
  let service: PreviewService;
  let tester: HttpTestingController;


  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(PreviewService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should upload files', () => {

    const files: File[] = [
      new File(["ONE"], "file1.txt"),
      new File(["TWO"], "file2.txt"),
      new File(["THREE"], "file3.txt")
    ];

    const previews: Preview[] = [
      {
        fileName: "giberish1.txt",
        id: 1,
        originalFileName: "file1.txt",
        primary: false,
        size: 3
      },
      {
        fileName: "giberish2.txt",
        id: 2,
        originalFileName: "file2.txt",
        primary: false,
        size: 3
      },
      {
        fileName: "giberish3.txt",
        id: 3,
        originalFileName: "file3.txt",
        primary: true,
        size: 5
      }
    ];

    service.uploadFiles(files).subscribe(event => {
      if (event.type == HttpEventType.Response)
      {
        expect(event.body).toEqual(previews);
      }
    });

    let req = tester.expectOne('/api/previews');

    expect(req.request.method).toBe('POST');

    req.flush(previews);

  });


});
