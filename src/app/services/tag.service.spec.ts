import { TestBed } from '@angular/core/testing';

import { TagService } from './tag.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page } from '../model/page';
import { Tag } from '../model/tag';

describe('TagService', () => {


  let service: TagService;
  let tester: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(TagService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should get a page of tags', () => {

    const page: Page<Tag> = {
      page: {
        number: 1,
        size: 3,
        totalElements: 232,
        totalPages: 64
      },
      content: [
        {
          name: "red",
          color: "#FF0000"
        },
        {
          name: "green",
          color: "#00FF00"
        },
        {
          name: "blue",
          color: "#0000FF"
        }
      ]
    }

    service.getTags().subscribe(p => {
      expect(p).toEqual(page);
    });

    let req = tester.expectOne('/api/tags?page=0&size=10&sort=name,ASC');

    expect(req.request.method).toBe('GET');

    req.flush(page);

  });


  it('should add a tag', () => {

    const tag: Tag = {
      name: "red",
      color: "#FF0000"
    };

    service.addTag(tag).subscribe(t => {
      expect(t).toEqual(tag);
    });

    let req = tester.expectOne('/api/tags');

    expect(req.request.method).toBe("POST");

    req.flush(tag);

  });


  it('should search tags', () => {

    const tags: Tag[] = [
      {
        name: "red",
        color: "#FF0000"
      },
      {
        name: "green",
        color: "#00FF00"
      },
      {
        name: "blue",
        color: "#0000FF"
      }
    ];

    service.searchTags("nfk").subscribe(ts => {
      expect(ts).toEqual(tags);
    });

    let req = tester.expectOne('/api/tags/search?q=nfk');

    expect(req.request.method).toBe("GET");

    req.flush(tags);

  });


});
