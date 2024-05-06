import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
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

}
