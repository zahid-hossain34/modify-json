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
        if (typeof value === 'object' && !Array.isArray(value)) {
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

  //  mergeMultipleJson(jsonArray: any[]): any {
  //   console.log(jsonArray);
    
  //   // if (jsonArray.length < 2) {
  //   //   return jsonArray[0] || {};
  //   // }

  //   const mergedJson = { ...jsonArray[0] };

  //   for (let i = 1; i < jsonArray.length; i++) {
  //     const currentJson = jsonArray[i];

  //     for (const key in currentJson) {
  //       if (currentJson.hasOwnProperty(key)) {
  //         if (mergedJson.hasOwnProperty(key)) {
  //           if (typeof mergedJson[key] === 'object' && typeof currentJson[key] === 'object') {
  //             mergedJson[key] = this.mergeJson(mergedJson[key], currentJson[key]);
  //           } else {
  //             // If the key exists and is not an object, do not overwrite
  //           }
  //         } else {
  //           // If the key doesn't exist, add it to the mergedJson
  //           mergedJson[key] = currentJson[key];
  //         }
  //       }
  //     }
  //   }

  //   return mergedJson;
  // }
  //  mergeJson(json1: any, json2: any): any {
  //   const mergedJson = { ...json1 };

  //   for (const key in json2) {
  //     if (json2.hasOwnProperty(key)) {
  //       if (mergedJson.hasOwnProperty(key)) {
  //         if (typeof mergedJson[key] === 'object' && typeof json2[key] === 'object') {
  //           mergedJson[key] = this.mergeJson(mergedJson[key], json2[key]);
  //         } else {
  //           // If the key exists and is not an object, do not overwrite
  //         }
  //       } else {
  //         // If the key doesn't exist, add it to the mergedJson
  //         mergedJson[key] = json2[key];
  //       }
  //     }
  //   }

  //   return mergedJson;
  // }
  //  arrayToObject(array: any[]): any {
  //   console.log(array);
    
  //   return array.reduce((acc, item) => {
  //     const key = Object.keys(item)[0];
  //     acc[key] = item[key];
  //     return acc;
  //   }, {});
  // }
  //  readJSONFile(file: File): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = (event: any) => {
  //       try {
  //         const json = JSON.parse(event.target.result);
  //         resolve(json);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };

  //     reader.readAsText(file);
  //   });
  // }


}
