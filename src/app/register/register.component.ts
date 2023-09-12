import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string = "";
  email: string = "";
  username: string = "";
  password: string = "";
  error: string = "";
  success: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  register(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { name: this.name, email: this.email, username: this.username, password: this.password };

    if (!this.name || !this.email || !this.username || !this.password) {
      this.error = "All fields are required.";
      return;
    }
    if(!this.email.includes("@")) {
      this.error = "Email does not have correct format.";
      return;
    }
    this.http.post<any>('http://localhost:8080/register', body, { headers }).subscribe(
      (data) => {
        if (data.error) {
          this.error = data.error; // Display the error message to the user
        } else {
          this.success = "You have successfully registered.";
        }
      },
      (error) => {
        console.error(error.error);
        this.error = error.error.error;
      }
    );
  }
}
