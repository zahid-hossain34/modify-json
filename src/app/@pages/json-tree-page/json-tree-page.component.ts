import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "src/app/@components/header/header.component";
import { TranslateJsonTreeComponent } from "src/app/translate-json-tree/translate-json-tree.component";


@Component({
  selector: 'app-json-tree-page',
  templateUrl: './json-tree-page.component.html',
  styleUrls: ['./json-tree-page.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    TranslateJsonTreeComponent
  ]
})
export class JsonTreePageComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }


}
