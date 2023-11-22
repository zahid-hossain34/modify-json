import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
  children!: FileNode[];
  root!: string;
  value: any;
}
export interface IUploadFileDetails{
  fileName?: string;
  fileInput?: string ;
  selectedFile?: File ;
}
@Injectable({
  providedIn: 'root',
})
export class TranslateJsonTreeService {
  dataChange = new BehaviorSubject<FileNode[]>([]);
  isDataSaved = new BehaviorSubject<boolean>(false);

  constructor() {}

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  /**
   * 
   * @param obj  is the JSON object of the uploaded file 
   * @param level  is the level of the JSON object initially it is 0
   * @returns  the array of FileNode objects
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key as keyof typeof obj];

      const node = new FileNode();

      node.root = key;

      /** check if value is null  */

      if (value != null) {
        /** check if value is object */
        if (typeof value === 'object') {
          /** call buildFileTree recursively */
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.value = value;
        }
      }
      /** return accumulator.concat(node) */
      return accumulator.concat(node);
    }, []);
  }

  /**
   * 
   * @param data is the array of updated data source array 
   * @returns  the updated data source objects as JSON
   */

  arrayToJSON(data: FileNode[]): FileNode[] {
    const result: any = {};

    function processNode(node: FileNode) {
      let obj: any = {};

      if (node?.children) {
        node.children.forEach((childNode: FileNode) => {
          obj[childNode.root] = processNode(childNode);
        });
      } else {
        obj = node.value;
      }
      return obj;
    }

    data.forEach((item: FileNode) => {
      result[item.root] = processNode(item);
    });

    return result;
  }
}
