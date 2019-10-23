import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
/** Usage:
 * <input type="text" [(ngModel)]="filter">
 * <div [innerHTML]="myAwesomeText  | highlight : filter"></div>
 * src https://gist.github.com/adamrecsko/0f28f474eca63e0279455476cc11eca7
 */

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(public sanitizer: DomSanitizer) {
  }

  transform(text: string, search): SafeHtml {
    if (search && text) {
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      pattern = pattern.split(' ').filter(t => t).join('|');
      pattern = pattern.replace(/[^а-яёa-z0-9|]/gi, '').replace(/[а-яёa-z0-9]/gi, '$&[^а-яёa-z0-9]*');
      const regex = new RegExp(pattern, 'gi');
      const newText = text.replace(regex, (match) =>
        `<span style="background-color: #1A85FF; border-radius: 2px; color: #fff">${match}</span>`);
      return this.sanitizer.bypassSecurityTrustHtml(newText);
    } else {
      return text;
    }
  }
}
