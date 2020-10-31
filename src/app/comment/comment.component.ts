import { Component, OnInit } from '@angular/core';
import { AgriculturistService } from '../services/agriculturist.service';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../models/comment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  comments: Array<Comment>;
  product = null;

  commentForm: FormGroup;
  errorMessage: string;
  submitted = false;
  commented = false;
  ordered = false;

  constructor(private route: ActivatedRoute, private agriculturistService: AgriculturistService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.agriculturistService.getComment(this.route.snapshot.paramMap.get('id')).subscribe(comments => this.comments = comments);
    this.agriculturistService.getProduct(this.route.snapshot.paramMap.get('id')).subscribe(product => this.product = product);
    this.agriculturistService.isCommented(this.route.snapshot.paramMap.get('id')).subscribe(commented => this.commented = commented);
    this.agriculturistService.isOrdered(this.route.snapshot.paramMap.get('id')).subscribe(ordered => this.ordered = ordered);

    this.commentForm = this.formBuilder.group({
      text: ['', [Validators.required]]
    });
  }

  addGarden() {
    this.submitted = true;

    // Stop here if form is invalid.
    if (this.commentForm.invalid) {
      return;
    }

    this.agriculturistService.addComment(this.route.snapshot.paramMap.get('id'), this.commentForm.value).subscribe(
      data => {
        this.agriculturistService.getComment(this.route.snapshot.paramMap.get('id')).subscribe(comments => this.comments = comments);
        this.agriculturistService.isCommented(this.route.snapshot.paramMap.get('id')).subscribe(commented => this.commented = commented);
        this.agriculturistService.isOrdered(this.route.snapshot.paramMap.get('id')).subscribe(ordered => this.ordered = ordered);
      },
      error => {
        this.errorMessage = error.error;
    });
  }

}
