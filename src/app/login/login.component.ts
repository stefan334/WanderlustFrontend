import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-sverice';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: string;

  constructor(public cookieService: CookieService, private authService: AuthService, private router: Router) {
    this.username='';
    this.password='';
    this.error='';
   }

  ngOnInit(): void {
    console.log("test");
    const token = this.cookieService.get('token');
    const decodedToken = jwt_decode(token) as DecodedToken;
    this.username = decodedToken.sub ;
    console.log(this.username);
  }

  login(): void {
    console.log("Logging in");
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log(response.access_token);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Set the expiration to 1 hour from now
        this.cookieService.set('token', response.access_token, expires);
        this.cookieService.set('username', response.username);
        this.router.navigate(['/']);

        
      },
      error => {
        console.log(error);
        this.error = 'Invalid credentials';
      }
    );
  }

  logout(): void{
      this.cookieService.delete("token");
      this.router.navigate(['/']);
  }
}
interface DecodedToken {
  sub: string;
  exp: number;
}
