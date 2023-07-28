export class QuizQuestion {
    id: number;
    questionText: string;
    answers: string[];
    selectedAnswer: string;
  
    constructor(id: number, questionText: string, answers: string[], selectedAnswer:string) {
      this.id = id;
      this.questionText = questionText;
      this.answers = answers;
      this.selectedAnswer = selectedAnswer;
    }
  }
  