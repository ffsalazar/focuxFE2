import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCollaborator'
})
export class FilterCollaboratorPipe implements PipeTransform {

  transform(value: unknown, args: any): unknown {
    let filterValue = args.value;
    return value;
  }

}
