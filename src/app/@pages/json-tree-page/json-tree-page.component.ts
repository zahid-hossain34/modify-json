import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "src/app/@components/header/header.component";
import { JsonTreeComponent } from "src/app/@components/json-tree/json-tree.component";


@Component({
  selector: 'app-json-tree-page',
  templateUrl: './json-tree-page.component.html',
  styleUrls: ['./json-tree-page.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    JsonTreeComponent
  ]
})
export class JsonTreePageComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }


}
