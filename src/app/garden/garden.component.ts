import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Garden } from '../models/garden';
import { AgriculturistService } from '../services/agriculturist.service';
import { Tree } from '../models/tree';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.css']
})
export class GardenComponent implements OnInit {

  garden: Garden = null;
  selectedTree: Tree = null;
  selectedPreparation = null;
  tree = null;
  progress = null;

  constructor(private route: ActivatedRoute,
              public toastService: ToastService,
              private agriculturistService: AgriculturistService) { }

  ngOnInit(): void {
    this.agriculturistService.getGardens().subscribe(gardens => {
      this.toastService.update(gardens);
    });
    this.agriculturistService.getGarden(this.route.snapshot.paramMap.get('id')).subscribe(garden => this.garden = garden);
  }

  addTree(i: Number, j: Number): void {
    this.agriculturistService.addTree(this.route.snapshot.paramMap.get('id'), i, j, this.selectedTree).subscribe(
      data => {
        this.agriculturistService.getGarden(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
          this.garden = garden;
          this.toastService.update([garden]);
        });
      },
      error => {
        console.log(error);
    });
  }

  remove(i: Number, j: Number): void {
    this.agriculturistService.removeTree(this.route.snapshot.paramMap.get('id'), i, j).subscribe(
      data => {
        this.agriculturistService.getGarden(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
          this.garden = garden;
          this.toastService.update([garden]);
        });
      },
      error => {
        console.log(error);
    });
  }

  addPreparation(i: Number, j: Number): void {
    this.agriculturistService.addPreparation(this.route.snapshot.paramMap.get('id'), i, j, this.selectedPreparation).subscribe(
      data => {
        this.agriculturistService.getGarden(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
          this.garden = garden;
          this.toastService.update([garden]);
        });
      },
      error => {
        console.log(error);
    });
  }

  menu(type: String, operation: String): void {
    if (type === "tank" && operation === "inc") {
      this.agriculturistService.incTank(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
        this.garden = garden;
        this.toastService.update([garden]);
      });
    } else if (type === "tank" && operation === "dec") {
      this.agriculturistService.decTank(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
        this.garden = garden
        this.toastService.update([garden]);
        ;});
    } else if (type === "temperature" && operation === "inc") {
      this.agriculturistService.incTemperature(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
        this.garden = garden;
        this.toastService.update([garden]);
      });
    } else if (type === "temperature" && operation === "dec") {
      this.agriculturistService.decTemperature(this.route.snapshot.paramMap.get('id')).subscribe(garden => {
        this.garden = garden;
        this.toastService.update([garden]);
      });
    }
  }

  toggle(toolTip, field: String) {

    this.tree = field;
    if (this.tree) {
      this.progress = (this.tree.progress / this.tree.days) * 100;
    }

    toolTip.open();
    toolTip._elementRef.nativeElement.shouldClose = true;

    toolTip._elementRef.nativeElement.addEventListener("mouseleave", (event) => {
      setTimeout(() => {
        if (toolTip._elementRef.nativeElement.shouldClose) {
          toolTip.close();
        }
      }, 10);
    });

    toolTip._windowRef.location.nativeElement.addEventListener('mouseover', (event) => {
      toolTip._elementRef.nativeElement.shouldClose = false;
    });

    toolTip._windowRef.location.nativeElement.addEventListener('mouseleave', (event) => {
      toolTip.close();
    });
  }

}
