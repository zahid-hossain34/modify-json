import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extentionRemover',
  standalone: true,
})
export class ExtentionRemoverPipe implements PipeTransform {

  transform(value: string, extension: string): string {
    if (value.endsWith(extension)) {
      return value.slice(0, -extension.length);
    }
    return value;
  }

}
