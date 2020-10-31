import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { EnterpriseService } from '../services/enterprise.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  stat = null;
  date = new Array(30);
  chart;

  constructor(private enterpriseService: EnterpriseService) { }

  ngOnInit(): void {
    this.enterpriseService.getStatistics().subscribe(stat => {
      this.stat = stat;

      for (let i = 0; i < 30; i++) {
        this.date[i] = new Date(new Date().setDate(new Date().getDate() - i)).toDateString();
      }

      const x: string[] = this.date.map(item => item.toString());
      const y: number[] = this.stat.map(item => item);

      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: x,
          datasets: [
            {
              data: y,
              label: 'Broj narudžbina u danu.',
              backgroundColor: 'Aqua'
            },
          ]
        },
        options: {
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Broj narudžbina'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Dan'
              }
            }]
          }
        }
      });

    });
  }

}
