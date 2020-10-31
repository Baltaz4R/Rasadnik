import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;
  submitted = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder) {

    // Redirect to home if already logged in.
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  login(): void {
    this.submitted = true;

    // Stop here if form is invalid.
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(
      data => {
        if (data.type === 'agriculturist') {
          this.router.navigate(['/agriculturist']);
        } else if (data.type === 'enterprise') {
          this.router.navigate(['/enterprise']);
        } else if (data.type === 'admin') {
          this.router.navigate(['/admin']);
        }
      },
      error => {
        this.errorMessage = error.error;
    });
  }

}
