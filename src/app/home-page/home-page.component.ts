import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

    let user = this.authenticationService.currentUserValue;

    if (user) {
      if (user.type === "agriculturist") {
        this.router.navigate(['/agriculturist']);
      } else if (user.type === "enterprise") {
        this.router.navigate(['/enterprise']);
      } else {
        this.router.navigate(['/admin']);
      }
    }
  }

  ngOnInit(): void {
  }

}
