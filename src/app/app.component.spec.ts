import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { JWToken } from './model/jwt-token';
import { provideRouter } from '@angular/router';


class AuthServiceMock {

  token: JWToken | null = null;

  getToken(): JWToken | null
  {
    return this.token;
  }

  setToken(token: JWToken): void
  {
    this.token = token;
  }

  logout(): void
  {
    this.token = null;
  }

}


describe('AppComponent', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {provide: AuthService, useClass: AuthServiceMock}
      ]
    }).compileComponents();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });


  it(`should hide menu if user is not authenticated`, () => {

    const auth = TestBed.inject(AuthService);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(auth.getToken()).withContext("logged off at first").toBeNull();

    let el: HTMLElement = fixture.nativeElement;
    
    expect(el.textContent).withContext("Katalog link visible").toContain("Katalog");

    expect(el.textContent).withContext("Ponude link not visible").not.toContain("Ponude");

  });


  it(`should display menu if user is authenticated`, () => {

    const auth = TestBed.inject(AuthService);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(auth.getToken()).withContext("logged off at first").toBeNull();

    const token: JWToken = {
      exp: "1970-01-01",
      jwttoken: "TEST TOKEN",
      username: "admin",
      role: "ADMIN"
    };

    auth.setToken(token);

    fixture.detectChanges();

    let el: HTMLElement = fixture.nativeElement;
    
    expect(el.textContent).withContext("Katalog link not visible").not.toContain("Katalog");

    expect(el.textContent).withContext("Ponude link visible").toContain("Ponude");

    expect(el.textContent).withContext("Korisnici link visible to admins").toContain("Korisnici");

    token.role = "USER";

    auth.setToken(token);

    fixture.detectChanges();

    expect(el.textContent).withContext("Korisnici link visible to admins").not.toContain("Korisnici");

  });


  it('should log out by clicking on "Odjava" link', () => {

    const auth = TestBed.inject(AuthService);

    const token: JWToken = {
      exp: "1970-01-01",
      jwttoken: "TEST TOKEN",
      username: "admin",
      role: "USER"
    };

    auth.setToken(token);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;

    let odjava: HTMLElement | null = null;
    
    el.querySelectorAll("a").forEach(l => {
      if (l.textContent?.includes("Odjava"))
      {
        odjava = l;
      }
    });

    expect(odjava).not.toBeNull();

    odjava!.dispatchEvent(new Event("click"));

    expect(auth.getToken()).toBeNull();

  });
  

});
