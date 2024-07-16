import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preview } from '../model/preview';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  constructor(
    private http: HttpClient
  ) { }


  uploadFiles(files: File[]): Observable<HttpEvent<Preview[]>>
  {

    let formData = new FormData();

    for (let index = 0; index < files.length; index++) {
      formData.append("files", files[index]);
    } 
    
    return this.http.post<Preview[]>("/api/previews", formData, {
      reportProgress: true,
      observe: 'events'
    });
    
  }

}
