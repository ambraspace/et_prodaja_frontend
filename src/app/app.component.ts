import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private auth: AuthService) {}
  
  title = 'et-prodaja';

  logout()
  {
    this.auth.logout();
  }

  isAuthenticated(): boolean
  {
    if (this.auth.getToken() != null)
      return true;
    return false;
  }

  isAdmin(): boolean
  {
    if (this.auth.getToken() && this.auth.getToken()!.role === 'ADMIN')
      return true;
    return false;
  }

}
