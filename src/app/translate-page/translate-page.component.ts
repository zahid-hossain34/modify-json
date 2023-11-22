import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TranslateJsonTreeComponent } from '../translate-json-tree/translate-json-tree.component';

@Component({
  selector: 'app-translate-page',
  templateUrl: './translate-page.component.html',
  styleUrls: ['./translate-page.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    TranslateJsonTreeComponent
  ]
})
export class TranslatePageComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }


}
