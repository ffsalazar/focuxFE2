import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'priorityRequest'
})
export class PriorityRequestPipe implements PipeTransform {

  transform(value: number): string {
      let descriptionPriority:string="";

      switch (value) {

          case 1:{
           descriptionPriority = "Prioridad Alta";
           break;
          }

          case 2:{
              descriptionPriority = "Prioridad Media";
              break;
          }

          case 3:{
              descriptionPriority = "Prioridad Baja";
              break;
          }


      }

    return descriptionPriority;
  }

}
