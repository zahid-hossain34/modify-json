import { Component, OnInit } from '@angular/core';
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
export class TranslateJsonTreeComponent implements OnInit {
  nestedTreeControl!: NestedTreeControl<FileNode>;
  nestedDataSource!: MatTreeNestedDataSource<FileNode>;
  fileName: string = '';
  fileInput: any;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  constructor(private translateJsonTreeService: TranslateJsonTreeService) {}

  existingFileDetails = new BehaviorSubject<IUploadFileDetails>({});

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.getDataSource();
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
    });
  }

  /**
   *  @returns  clear the file input
   * and file name
   * and set the data source to
   * empty array on remove file
   */
  removeFile() {
    this.fileInput.value = '';
    this.fileName = '';
    this.nestedDataSource.data = [];
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
    if (!event.target.files?.length) {
      this.existingFileDetails.subscribe((data: any) => {
        this.fileName = data.fileName;
        this.fileInput = data.fileInput;
        this.selectedFile = data.selectedFile;
      });
    } else {
      this.fileInput = event.target;
      this.fileName = this.fileInput.files?.[0]?.name || '';
      this.selectedFile = event.target.files[0];
      this.existingFileDetails.next({
        fileName: this.fileName,
        fileInput: this.fileInput,
        selectedFile: this.selectedFile as File,
      });
      if (this.selectedFile) {
        this.isLoading = true;
        this.readFile();
      }
    }
  }

  /**
   *  @returns  the updated data source array
   * and set the data change to updated data source array
   * and set the loading to false
  */

  readFile(): void {
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        const data = this.translateJsonTreeService.buildFileTree(jsonData, 0);

        this.translateJsonTreeService.dataChange.next(data);
      } catch (error) {
        alert('Error parsing JSON file.');
      } finally {
        this.isLoading = false;
      }
    };

    fileReader.readAsText(this.selectedFile as File);
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
    const updatedJSONData = this.getUpdateJSONData();

    const blob = new Blob([JSON.stringify(updatedJSONData)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and click it to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `updated_${this.fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up resources
    window.URL.revokeObjectURL(url);
  }
}
