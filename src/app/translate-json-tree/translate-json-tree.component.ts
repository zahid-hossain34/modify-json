import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  FileNode,
  TranslateJsonTreeService,
} from './translate-json-tree.service';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TextFieldModule} from '@angular/cdk/text-field';

@Component({
  selector: 'app-translate-json-tree',
  templateUrl: './translate-json-tree.component.html',
  styleUrls: ['./translate-json-tree.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TextFieldModule,

    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
})
export class TranslateJsonTreeComponent implements OnChanges , OnInit {
  @Input() isDataSaved: boolean = false ;
  nestedTreeControl!: NestedTreeControl<FileNode>;
  nestedDataSource!: MatTreeNestedDataSource<FileNode>;
  fileName: string = '';
  fileInput: any;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  updateJsonData: any;

  constructor(private translateJsonTreeService: TranslateJsonTreeService) {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.isDataSaved = changes['isDataSaved'].currentValue;
  }

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.getDataSource();
    
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.value;

  private _getChildren = (node: FileNode) => node.children;

  getDataSource() {
    this.translateJsonTreeService.dataChange.subscribe((data: any) => {
      if (!data) return;
      this.nestedDataSource.data = data;
    });
  }
  
  onValueChange(node: FileNode) {
    console.log('node',node);
    const updateValueKey = node.root 
    const updateValue = node.value;
    this.updateValueForKey(this.updateJsonData, updateValueKey, updateValue);
    // node.value = event.target.value;
    console.log('this.updateJsonData',this.updateJsonData);
    
  }
  updateValueForKey(data:any, updateValueKey:any, updateValue:any){
    console.log('data',data);
    if(data && data.hasOwnProperty(updateValueKey)){
      data[updateValueKey].value = updateValue;
      console.log('data[updateValueKey].value',data[updateValueKey].value);
      console.log('data[updateValueKey].value',data);
      
      return data;
    }
    if (data && typeof data['updateValueKey'] === 'object') {
      console.log('data.children');
      
      for (const childKey in data.children) {
        if (data.children.hasOwnProperty(childKey)) {
          const child = data.children[childKey];
          if (this.updateValueForKey(child, updateValueKey, updateValue)) {
            return data; // Key found and updated in a child
          }
        }
      }
    }
    return data; // Key not found
  }

  removeFile() {
    this.fileInput.value = '';
    this.fileName = '';
    this.nestedDataSource.data = [];
  }

  onFileUpload(event: any) {
    this.fileInput = event.target;
    this.fileName = this.fileInput.files?.[0]?.name || '';
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.isLoading = true;
      this.readFile();
    }
  }

  readFile(): void {
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        console.log('this.jsonData',jsonData);
        this.updateJsonData = jsonData;
        console.log('this.updateJsonData',this.updateJsonData);
        
        
        const data = this.translateJsonTreeService.buildFileTree(jsonData, 0);
       console.log('data',data);
       
        this.translateJsonTreeService.dataChange.next(data);
      } catch (error) {
        alert('Error parsing JSON file.');
      } finally {
        this.isLoading = false;
      }
    };

    fileReader.readAsText(this.selectedFile as File);
  }
  onDownload(): void {
    console.log(this.nestedDataSource.data);
    
    const blob = new Blob([JSON.stringify(this.nestedDataSource.data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and click it to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up resources
    window.URL.revokeObjectURL(url);
  }
}
