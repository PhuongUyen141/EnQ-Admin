import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  signInForm: FormGroup;
  errorMessage: string = null;
  isLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-z]{6,32}$/i),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$/),
        ]),
      ],
    });
  }

  onSubmit(): void {
    this.authService
      .logIn(this.signInForm.value.email, this.signInForm.value.password)
      .subscribe({
        next: (v: unknown) => this.handleSuccess(v),
        error: (e: Error) => this.handleError(e)
      });
  }

  handleError(e: Error): void {
    console.log(e.message);
  }

  handleSuccess(v: unknown): void {
    console.log(v);
  }

  signUpButton: HTMLElement  = document.getElementById('signUp');
	signInButton = <HTMLInputElement> document.getElementById('signIn');
	container = <HTMLInputElement> document.getElementById('container');

  onClickSignUp(): void {
      if(this.signUpButton){
        this.signUpButton.addEventListener('click', () => {
          this.container.classList.add("right-panel-active");
          console.log('abc');  
        });
      }else{
        console.log("null: " + this.signUpButton);
      }
  }

  onClickSignIn(): void {
      this.signInButton.addEventListener('click', () => {
      this.container.classList.remove("right-panel-active");
    });
  }
}
