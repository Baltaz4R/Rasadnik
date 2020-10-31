import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  // Check whether our password and confirm password match.
  static passwordMatch(control: FormControl): void {
    const password: string = control.get('password').value;
    const repeat: string = control.get('repeat').value;

    if (password !== repeat) {
      control.get('repeat').setErrors({ noPassswordMatch: true });
    }
  }

  // Check if a phone number is valid.
  static phone(control: FormControl): { [key: string]: boolean } | null {

    // If control is empty return no error.
    if (!control.value) {
      return null;
    }

    let regex: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    if (regex.test(control.value)) {
      return null;
    } else {
      return { phone: true };
    }
  }

  // Check whether the entered password has a number.
  static containsNumber(control: FormControl): { [key: string]: boolean } | null {

    // If control is empty return no error.
    if (!control.value) {
      return null;
    }

    let regex: RegExp = /\d/;

    if (regex.test(control.value)) {
      return null;
    } else {
      return { containsNumber: true };
    }
  }

  // Check whether the entered password has upper case letter.
  static containsCapitalCase(control: FormControl): { [key: string]: boolean } | null {

    // If control is empty return no error.
    if (!control.value) {
      return null;
    }

    let regex: RegExp = /[A-Z]/;

    if (regex.test(control.value)) {
      return null;
    } else {
      return { containsCapitalCase: true };
    }
  }

  // Check whether the entered password has a special character.
  static containsSpecialCharacters(control: FormControl): { [key: string]: boolean } | null {

    // If control is empty return no error.
    if (!control.value) {
      return null;
    }

    let regex: RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (regex.test(control.value)) {
      return null;
    } else {
      return { containsSpecialCharacters: true };
    }
  }

  // Check whether the entered password start with letter.
  static startWithLetter(control: FormControl): { [key: string]: boolean } | null {

    // If control is empty return no error.
    if (!control.value) {
      return null;
    }

    let regex: RegExp = /^[a-zA-Z]/;

    if (regex.test(control.value)) {
      return null;
    } else {
      return { startWithLetter: true };
    }
  }

}