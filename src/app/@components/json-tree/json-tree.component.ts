import { Component, OnInit, Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFieldModule } from '@angular/cdk/text-field';

import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExtentionRemoverPipe } from 'src/app/@application/pipes/extentionRemover.pipe';
import { TextFormationPipe } from 'src/app/@application/pipes/textFormation.pipe';
import { JsonServiceService } from 'src/app/@application/services/jsonService.service';
import {
  FileNode,
  IUploadFileDetails,
} from 'src/app/@application/interfaces/base.interface';
import { UtilsService } from 'src/app/@application/services/utils.service';


@Component({
  selector: 'app-json-tree',
  templateUrl: './json-tree.component.html',
  styleUrls: ['./json-tree.component.css'],
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
export class JsonTreeComponent implements OnInit {
  nestedTreeControl!: NestedTreeControl<FileNode>;
  nestedDataSource!: MatTreeNestedDataSource<FileNode>;
  fileInput: any;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  fileLists: any[] = [];
  jsonData: any = {};
  jsonFIleIndex!: number;
  selectedJsonFiles!: any;
  selectedFileName: string = '';

  constructor(
    private jsonSerive: JsonServiceService,
    private utilsService: UtilsService
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
    this.jsonSerive.dataChange.subscribe((data: any) => {
      if (!data) return;
      this.nestedDataSource.data = data;
    });
  }

  /**
   *  @returns  clear the file input
   * and file name
   * and set the data source to
   * empty array on remove file
   * and set the loading to false on file upload
   * and remove the file from the file list
   * and remove the file from the json data
   * and remove the file from the selected json files
   */
  removeFile(fileNameToRemove: string | any, index: number) {
    this.selectedFileName = '';

    this.isLoading = true;
    this.selectedJsonFiles.splice(index, 1);
    this.fileLists = this.fileLists.filter(
      (file: any) => file.name !== fileNameToRemove
    );
    this.isLoading = true;
    this.jsonSerive.jsonFileList.subscribe((data: any) => {
      const uniqueObject = this.utilsService.createUniqueKeysObject(data);
      const finalJson = this.utilsService.addMissingKeysToAllObjects(
        data,
        uniqueObject
      );
      this.jsonData = finalJson;
      const finalMergedJson = this.jsonSerive.merge(finalJson);
      const dataSourceData = this.jsonSerive.buildFileTree(finalMergedJson, 0);
      this.jsonSerive.dataChange.next(dataSourceData);
      this.isLoading = false;
    });

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
    console.log(event);
    
    this.selectedFileName = '';
    this.fileLists = [...event.target.files];
    this.fileInput = event.target;
    this.isLoading = true;
    this.jsonSerive.mergeUploadedFiles(event.target.files).then((data) => {
      this.jsonData = data;
      const finalJson = this.jsonSerive.merge(this.jsonData);
      const dataSourceData = this.jsonSerive.buildFileTree(finalJson, 0);
      this.isLoading = false;
      this.jsonSerive.dataChange.next(dataSourceData);
    });
  }

  /**
   *
   * @returns  the updated data source array as JSON
   * and create a blob and create a url and create a link element and click it to trigger the download
   * and revoke the object URL to free up resources
   */

  onDownload(): void {
    this.jsonData.forEach((jsonObject: unknown, index: number) => {
      const fileName = `Updated_${this.fileLists[index].name}`;
      this.jsonSerive.downloadJson(jsonObject, fileName);
    });
  }

  /**
   * 
   * @param event  is the event object of the input change event 
   * @param node  is the node name of the input field
   * @param index  is the index of the node in the JSON array 
   * @returns  update the selected JSON object with the input value 
   */
  onValueChange(event: any, node: string, index: number) {
    this.jsonFIleIndex = index;
    this.jsonSerive.updateIndividualObject(
      this.jsonData[index],
      node,
      event.target.value
    );
  }
  /**
   * 
   * @param fileNamae is the name of the file
   * @returns  set the selected file name to the file name on focus of the text area 
   */
  onFocusTextArea(fileNamae: string) {
    this.selectedFileName = fileNamae;
  }

  /**
   * 
   * @returns  set the selected file name to empty string on focus out of the text area 
   */

  offFocusTextArea() {
    this.selectedFileName = '';
  }
}
