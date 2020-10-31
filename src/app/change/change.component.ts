import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {

  passwordForm: FormGroup;
  errorMessage: string;
  submitted = false;

  constructor(private router: Router,
              private userService: UserService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      old: ['', Validators.required],
      password: ['', [Validators.required,
                      Validators.minLength(7),
                      CustomValidatorsService.containsNumber,
                      CustomValidatorsService.containsCapitalCase,
                      CustomValidatorsService.containsSpecialCharacters,
                      CustomValidatorsService.startWithLetter]],
      repeat: ['', Validators.required]
    }, {
      // Check whether our password and confirm password match.
      validator: CustomValidatorsService.passwordMatch
    });
  }

  change(): void {
    this.submitted = true;

    // Stop here if form is invalid.
    if (this.passwordForm.invalid) {
      return;
    }

    this.userService.change(this.passwordForm.controls.old.value, this.passwordForm.controls.password.value).subscribe(
      data => {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = error.error;
    });
  }

}
