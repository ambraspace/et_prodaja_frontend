import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  getContacts(companyId: number): Observable<Contact[]>
  {
    return this.http.get<Contact[]>(`/api/companies/${companyId}/contacts`);
  }

  getContact(companyId: number, id: number): Observable<Contact>
  {
    return this.http.get<Contact>(`/api/companies/${companyId}/contacts/${id}`);
  }

  addContact(companyId: number, contact: Contact): Observable<Contact>
  {
    return this.http.post<Contact>(`/api/companies/${companyId}/contacts`, contact);
  }

  updateContact(companyId: number, id: number, contact: Contact): Observable<Contact>
  {
    return this.http.put<Contact>(`/api/companies/${companyId}/contacts/${id}`, contact);
  }

  deleteContact(companyId: number, id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/companies/${companyId}/contacts/${id}`);
  }

}
