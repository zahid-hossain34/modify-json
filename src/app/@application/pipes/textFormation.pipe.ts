import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFormation',
  standalone: true,
})
export class TextFormationPipe implements PipeTransform {

  transform(value: string): string {
    // Replace underscores and hyphens with spaces
    let result = value.replace(/[_-]/g, ' ');

    // Capitalize the text
    result = result.toLowerCase().replace(/(?:^|\s)\S/g, (a: string) => {
      return a.toUpperCase();
    });

    return result;
  }

}
