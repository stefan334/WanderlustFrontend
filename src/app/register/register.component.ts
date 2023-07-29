import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string="";
  email: string="";
  username: string="";
  password: string="";
  error: string="";
  succesful:string="";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  register(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { name: this.name, email: this.email, username: this.username, password: this.password };

    this.http.post<any>('http://localhost:8080/register', body, { headers }).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
        this.error = 'An error occurred while registering. Please try again.';
      }
    );
    if(!this.error)
      this.succesful = "You have succesfully registered."
  }
}
