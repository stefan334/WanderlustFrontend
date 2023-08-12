import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient , HttpHeaders} from '@angular/common/http'; // Import HttpClient
import { CookieService } from 'ngx-cookie-service';
import { QuizQuestion } from '../quiz/quiz-question.model';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  modalRef: BsModalRef;
  showLogin = true;
  quizModalRef: BsModalRef;
  quizQuestions: QuizQuestion[] = []; // Variable to store the quiz questions
  currentQuestionIndex = 0;
  selectedAnswer: string = "";
  submitted = false;
  locations : string= "";
  username:string="";
  
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private http: HttpClient, // Inject HttpClient
    public cookieService: CookieService
  ) {
    this.modalRef = new BsModalRef();
    this.quizModalRef = new BsModalRef();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openQuizModal(template: TemplateRef<any>) {
    this.quizQuestions = []; // Reset quiz questions
    this.quizModalRef = this.modalService.show(template);
    this.fetchQuizQuestions();
    this.currentQuestionIndex = 0;
    this.selectedAnswer = "";
    this.submitted = false;
  }
  goToPreviousQuestion() {
    this.currentQuestionIndex--;
    this.selectedAnswer = "";
  }

  goToNextQuestion() {
    if (this.selectedAnswer) {
      this.quizQuestions[this.currentQuestionIndex].selectedAnswer = this.selectedAnswer;
      this.currentQuestionIndex++;
      this.selectedAnswer = "";
    }
  }


  toggleLoginRegister() {
    this.showLogin = !this.showLogin;
  }
  
  fetchQuizQuestions() {
  const token = this.cookieService.get('token'); // Retrieve the authentication token from cookie
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in request headers

    this.http.get<any>('http://localhost:8080/questions', { headers }).subscribe(
      (questions: QuizQuestion[]) => {
        this.quizQuestions = questions;
      },
      (error) => {
        // Handle the error
        console.error(error);
      }
    );
  }

  submitQuiz() {
    if (this.selectedAnswer) {
      this.quizQuestions[this.currentQuestionIndex].selectedAnswer = this.selectedAnswer;
    }
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userEmail = NavbarComponent.getUserEmailFromToken(token);
  
    const answersToUpdate: Record<number, string> = {};
    this.quizQuestions.forEach((question) => {
      answersToUpdate[question.id] = question.selectedAnswer;
    });
  
    this.http.post(`http://localhost:8080/answers?userEmail=${userEmail}`, answersToUpdate, { headers }).subscribe(
      (response) => {
        console.log('Quiz answers updated successfully');
        this.submitted = true;
      },
      (error) => {
        console.error('Failed to update quiz answers');
      }
    );
  }
  navigateToProfile() {
    // Navigate to the profile route with the given username
    
    this.router.navigate(['/profile', this.cookieService.get("username")]);
  }

  navigateToUserFeed(): void {
    this.router.navigate(['/user-feed']); // Navigate to the UserFeedComponent route
  }

  static getUserEmailFromToken(token: any) {
    try {
      // Decode the token
      const decodedToken: any = jwt_decode(token);
  
      // Access the email from the decoded payload
      const userEmail: string = decodedToken.sub;
      console.log(decodedToken);
      return userEmail;
    } catch (error) {
      // Handle any errors during decoding
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  openImageUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // Perform any additional configuration or pass data to the modal if needed
  }
  
submitForm() {
  // Retrieve the user's email from your authentication logic
  const token = this.cookieService.get('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const email = NavbarComponent.getUserEmailFromToken(token);

  // Process the locations array
  const locationsArray = this.locations.split(',').map(location => location.trim());

  // Call the API endpoint to add the locations
  this.http.post('http://localhost:8080/user/locations', { email, locations: locationsArray }, {headers}).subscribe(
    () => {
      console.log('Locations added successfully');
      this.modalRef.hide();
    },
    error => {
      console.error('Error adding locations', error);
    }
  );
}
}
