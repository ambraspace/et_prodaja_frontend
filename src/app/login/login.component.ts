import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private auth: AuthService, private router: Router) {};

  username: string = "";
  password: string = "";


  login()
  {

    this.auth.authenticate(this.username, this.password).subscribe(
       (token) => {
          this.auth.setToken(token);
          if (this.auth.returnUrl !== null && this.auth.returnUrl !== "/login")
          {
            this.router.navigateByUrl(this.auth.returnUrl);
          } else {
            this.router.navigateByUrl("/");
          }
      }
    );

  }

  logout()
  {
    this.auth.logout();   
    this.router.navigateByUrl("/login");
  }

}
