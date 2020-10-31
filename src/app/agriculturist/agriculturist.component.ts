import { Component, OnInit } from '@angular/core';
import { AgriculturistService } from '../services/agriculturist.service';
import { Garden } from '../models/garden';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-agriculturist',
  templateUrl: './agriculturist.component.html',
  styleUrls: ['./agriculturist.component.css']
})
export class AgriculturistComponent implements OnInit {

  gardens: Array<Garden>;

  gardenForm: FormGroup;
  errorMessage: string;
  submitted = false;

  constructor(public toastService: ToastService,
              private agriculturistService: AgriculturistService,
              private formBuilder: FormBuilder) {

    this.agriculturistService.getGardens().subscribe(gardens => {
      this.gardens = gardens;
      this.toastService.update(gardens);
    });
  }

  ngOnInit(): void {
    this.gardenForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      place: ['', [Validators.required, Validators.minLength(2)]],
      width: ['', Validators.required],
      height: ['', Validators.required]
    });
  }

  addGarden(): void {
    this.submitted = true;

    // Stop here if form is invalid.
    if (this.gardenForm.invalid) {
      return;
    }

    this.agriculturistService.addGarden(this.gardenForm.value).subscribe(
      data => {
        this.agriculturistService.getGardens().subscribe(gardens => {
          this.gardens = gardens;
          this.toastService.update(gardens);
        });
      },
      error => {
        this.errorMessage = error.error;
    });
  }

}
