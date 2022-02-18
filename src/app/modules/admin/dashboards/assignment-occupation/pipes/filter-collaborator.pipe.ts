import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCollaborator'
})
export class FilterCollaboratorPipe implements PipeTransform {

  transform(value: unknown, args: any): unknown {
    console.log("pipe: ", args);

    console.log("value: ", value);
    let filterValue = args.value;

    console.log(filterValue);
    return value;
  }

}
