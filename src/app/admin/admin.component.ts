import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  enterprises;
  agriculturists;
  all = false;
  editAgriculturists;
  editEnterprises;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRequests().subscribe((requests: Array<any>) => {
      this.enterprises = [];
      this.agriculturists = [];
      this.all = false;
      this.editAgriculturists = [];
      this.editEnterprises = [];

      requests.forEach(request => {
        if (request.type == 'agriculturist') {
          this.agriculturists.push(request);
        } else {
          this.enterprises.push(request);
        }
      });
    });
  }

  accept(id): void {
    this.userService.accept(id).subscribe(data => {
      this.userService.getRequests().subscribe((requests: Array<any>) => {
        this.enterprises = [];
        this.agriculturists = [];

        requests.forEach(request => {
          if (request.type == 'agriculturist') {
            this.agriculturists.push(request);
          } else {
            this.enterprises.push(request);
          }
        });
      });
    });
  }

  cancle(id): void {
    this.userService.cancle(id).subscribe(data => {
      this.userService.getRequests().subscribe((requests: Array<any>) => {
        this.enterprises = [];
        this.agriculturists = [];

        requests.forEach(request => {
          if (request.type == 'agriculturist') {
            this.agriculturists.push(request);
          } else {
            this.enterprises.push(request);
          }
        });
      });
    });
  }

  getAll(): void {
    this.all = true;

    this.userService.getAgriculturists().subscribe((agriculturists: Array<any>) => {
      this.agriculturists = agriculturists

      this.editAgriculturists = new Array(agriculturists.length).fill(false);
    });
    this.userService.getEnterprises().subscribe((enterprises: Array<any>) => {
      this.enterprises = enterprises

      this.editEnterprises = new Array(enterprises.length).fill(false);
    });
  }

  changeAgriculturists(index): void {
    this.userService.changeAgriculturists(this.agriculturists[index]).subscribe(
      data => {
        this.editAgriculturists[index] = false;
        this.getAll();
      },
      error => {
        console.log(error);
    });    
  }

  deleteAgriculturists(agriculturist) {
    this.userService.deleteAgriculturists(agriculturist._id).subscribe(
      data => {
        this.getAll();
      },
      error => {
        console.log(error);
    });
  }

  changeEnterprises(index): void {
    this.userService.changeEnterprises(this.enterprises[index]).subscribe(
      data => {
        this.editEnterprises[index] = false;
        this.getAll();
      },
      error => {
        console.log(error);
    });    
  }

  deleteEnterprises(enterprises) {
    this.userService.deleteEnterprises(enterprises._id).subscribe(
      data => {
        this.getAll();
      },
      error => {
        console.log(error);
    });
  }

  edit(): boolean {
    for (let i = 0; i < this.editAgriculturists.length; i++) {
      if (this.editAgriculturists[i]) {
        return true;
      }
    }

    for (let i = 0; i < this.editEnterprises.length; i++) {
      if (this.editEnterprises[i]) {
        return true;
      }
    }
    return false;
  }

}
