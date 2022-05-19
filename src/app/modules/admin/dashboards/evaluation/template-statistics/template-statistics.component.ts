import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-statistics',
  templateUrl: './template-statistics.component.html',
  styleUrls: ['./template-statistics.component.scss']
})
export class TemplateStatisticsComponent implements OnInit {

    estadoisticas : any[]=[
        {
            id :1,
            description :"Cumplimiento",
            dato1 : 72,
            dato2 : 64,
            dato3 : 0
        },
        {
            id :2,
            description :"Completados",
            dato1 : 96,
            dato2 : 84,
            dato3 : 75
        },
        {
            id :3,
            description :"Pendientes",
            dato1 : 45,
            dato2 : 55,
            dato3 : 75
        },
        {
            id :4,
            description :"Total Col",
            dato1 : 100,
            dato2 : 85,
            dato3 : 25
        }
    ];
    evaluadores : any[]=[
        {
            id :1,
            description :"Carmen Capote",
            dato1 : 72,
            dato2 : 64,
            dato3 : 50
        },
        {
            id :2,
            description :"Daniel Jimenes",
            dato1 : 96,
            dato2 : 84,
            dato3 : 75
        },
        {
            id :3,
            description :"Freddy Salazar",
            dato1 : 45,
            dato2 : 55,
            dato3 : 75
        },
        {
            id :4,
            description :"Jesus Reyes",
            dato1 : 100,
            dato2 : 85,
            dato3 : 25
        },
        {
            id :5,
            description :"Suma Total",
            dato1 : 313,
            dato2 : 288,
            dato3 : 225
        }
    ];

  constructor() { }

  ngOnInit(): void {
  }

    displayedColumns: string[] = ['demo-description', 'demo-dato1', 'demo-dato2', 'demo-dato3'];
    dataSource = this.estadoisticas;

    columns: string[] = ['demo-description', 'demo-dato1', 'demo-dato2', 'demo-dato3'];
    Source = this.evaluadores;


}
