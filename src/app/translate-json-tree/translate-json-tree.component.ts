import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  FileNode,
  TranslateJsonTreeService,
} from './translate-json-tree.service';

@Component({
  selector: 'app-translate-json-tree',
  templateUrl: './translate-json-tree.component.html',
  styleUrls: ['./translate-json-tree.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class TranslateJsonTreeComponent {
  nestedTreeControl!: NestedTreeControl<FileNode>;
  nestedDataSource!: MatTreeNestedDataSource<FileNode>;

  constructor(private translateJsonTreeService: TranslateJsonTreeService) {
  }
  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    this.translateJsonTreeService.dataChange.subscribe((data:any) => this.nestedDataSource.data = data);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.value;

  private _getChildren = (node: FileNode) => node.children;
}
