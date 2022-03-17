import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'priorityRequest'
})
export class PriorityRequestPipe implements PipeTransform {

  transform(value: number): string {
      let descriptionPriority:string="";

      switch (value) {

          case 1:{
           descriptionPriority = "Alta";
           break;
          }

          case 2:{
              descriptionPriority = "Media";
              break;
          }

          case 3:{
              descriptionPriority = "Baja";
              break;
          }


      }

    return descriptionPriority;
  }

}
