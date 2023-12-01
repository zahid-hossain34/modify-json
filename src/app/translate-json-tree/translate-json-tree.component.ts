import { Component, OnInit, Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import {
  FileNode,
  IUploadFileDetails,
  TranslateJsonTreeService,
} from './translate-json-tree.service';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFieldModule } from '@angular/cdk/text-field';

import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextFormationPipe } from '../@application/pipes/textFormation.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ExtentionRemoverPipe } from '../@application/pipes/extentionRemover.pipe';
import { JsonServiceService } from '../@application/services/jsonService.service';

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
    TextFormationPipe,
    ExtentionRemoverPipe,

    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [],
})
export class TranslateJsonTreeComponent implements OnInit {
  nestedTreeControl!: NestedTreeControl<FileNode>;
  nestedDataSource!: MatTreeNestedDataSource<FileNode>;
  fileName: string = '';
  fileInput: any;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  fileLists: File[] = [];
  jsonData: any = {};
  node: any;
  jsonFIleIndex!: number;
  selectedJsonFiles!: any;

  constructor(
    private translateJsonTreeService: TranslateJsonTreeService,
    private jsonSerive: JsonServiceService
  ) {}

  existingFileDetails = new BehaviorSubject<IUploadFileDetails>({});

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.getDataSource();
    this.getJsonFiles();

  }
  getJsonFiles() {
    this.jsonSerive.jsonFileList.subscribe((data: any) => {
      console.log('',data);
      this.selectedJsonFiles = data;
    });
  }

  /**
   *
   * @param _  is the index of the node
   * @param nodeData  is the FileNode object
   * @returns  true if the node has children otherwise false
   */

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.value;

  /**
   *
   * @param node  is the FileNode object
   * @returns  the array of FileNode objects
   */

  private _getChildren = (node: FileNode) => node.children;

  /** 
  @returns  the array of FileNode array objects
  */
  getDataSource() {
    this.translateJsonTreeService.dataChange.subscribe((data: any) => {
      if (!data) return;
      this.nestedDataSource.data = data;
      console.log(data);
    });
  }

  /**
   *  @returns  clear the file input
   * and file name
   * and set the data source to
   * empty array on remove file
   */
  removeFile(fileNameToRemove: string | any, index: number) {
    this.selectedJsonFiles.splice(index, 1);
    this.fileLists = this.fileLists.filter(
      (file: any) => file.name !== fileNameToRemove
    );

    if (this.fileLists.length === 0) {
      this.nestedDataSource.data = [];
      this.fileInput.value = '';
    }
  }

  /**
   *
   * @param event is the event object of the file upload
   * @returns  the file name and file input and selected file and
   * read the file and set the data source to updated data source array and
   * set the loading to false on file upload
   *
   */

  onFileUpload(event: any) {
    this.fileLists = [...event.target.files];
    this.fileInput = event.target;
    this.fileName = this.fileInput.files?.[0]?.name || '';

    this.isLoading = true;
    this.jsonSerive.mergeUploadedFiles(event.target.files).then((data) => {
      this.jsonData = data;
      console.log(this.jsonData);
      
      const datatest = this.translateJsonTreeService.buildFileTree(
        this.jsonData,
        0
      );
      this.isLoading = false;
      this.translateJsonTreeService.dataChange.next(datatest);
    });

  }



  /**
   *
   * @returns  the updated data source array as JSON
   */

  getUpdateJSONData() {
    return this.translateJsonTreeService.arrayToJSON(
      this.nestedDataSource.data
    );
  }

  /**
   *
   * @returns  the updated data source array as JSON
   * and create a blob and create a url and create a link element and click it to trigger the download
   * and revoke the object URL to free up resources
   */

  onDownload(): void {
 
    this.selectedJsonFiles.forEach((jsonObject:any, index:number) => {
      const fileName = `new_${this.fileLists[index].name}`;
      this.jsonSerive.downloadJson(jsonObject, fileName);
    });
  }

  onValueChange(event: any, node: any, index: number) {
    console.log(index);
    console.log(node);
    

    this.node = node;
    this.jsonFIleIndex = index;

    console.log(this.selectedJsonFiles);
    const test  = this.jsonSerive.updateNestedObject(this.selectedJsonFiles[index], node.root, event.target.value);
      console.log(test);
     
  }
  getValue() {
    // const test  = this.jsonSerive.getAllValues(this.selectedJsonFiles[index]);
    // console.log(test);
    return 'test';

    
    
  }

}
