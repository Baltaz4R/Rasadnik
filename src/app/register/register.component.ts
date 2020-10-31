import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  agriculturistForm: FormGroup;
  enterpriseForm: FormGroup;
  agriculturistSubmitted = false;
  enterpriseSubmitted = false;
  errorMessage: string;
  type: string  = "agriculturist";
  captchaResponse = null;

  constructor(private router: Router,
              private userService: UserService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder) {

    // Redirect to home if already logged in.
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.agriculturistForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required,
                      Validators.minLength(7),
                      CustomValidatorsService.containsNumber,
                      CustomValidatorsService.containsCapitalCase,
                      CustomValidatorsService.containsSpecialCharacters,
                      CustomValidatorsService.startWithLetter]],
      repeat: ['', Validators.required],
      date: ['', Validators.required],
      place: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, CustomValidatorsService.phone]],
      email: ['', [Validators.required, Validators.email]]
    }, {
      // Check whether our password and confirm password match.
      validator: CustomValidatorsService.passwordMatch
    });

    this.enterpriseForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required,
                      Validators.minLength(7),
                      CustomValidatorsService.containsNumber,
                      CustomValidatorsService.containsCapitalCase,
                      CustomValidatorsService.containsSpecialCharacters,
                      CustomValidatorsService.startWithLetter]],
      repeat: ['', Validators.required],
      date: ['', Validators.required],
      place: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    }, {
      // Check whether our password and confirm password match.
      validator: CustomValidatorsService.passwordMatch
    });
  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  changeForm(event): void {
    this.agriculturistSubmitted = false;
    this.enterpriseSubmitted = false;

    this.errorMessage = null;

    this.agriculturistForm.reset();
    this.enterpriseForm.reset();
  }

  register(): void {
    let user: User;

    if (this.type === "agriculturist") {
      this.agriculturistSubmitted = true;
      this.enterpriseSubmitted = false;

      // Stop here if form is invalid.
      if (this.agriculturistForm.invalid || this.captchaResponse == null) {
        return;
      }

      this.agriculturistForm.value.type = this.type;
      user = this.agriculturistForm.value;
    } else {
      this.agriculturistSubmitted = false;
      this.enterpriseSubmitted = true;

      // Stop here if form is invalid.
      if (this.enterpriseForm.invalid || this.captchaResponse == null) {
        return;
      }

      this.enterpriseForm.value.type = this.type;
      user = this.enterpriseForm.value;
    }

    this.userService.register(user).subscribe(
      data => {
        alert("Uspešno ste poslali zahtev za registraciju. Molimo vas sečekajte da se vaš zahtev ovbradi.");
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = error.error;
    });
  }

}
