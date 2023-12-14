import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModifyDataService } from './modify-data.service';
import { FileNode } from '../interfaces/base.interface';

@Injectable({
  providedIn: 'root',
})
export class JsonServiceService {
  constructor(private modifyDataService: ModifyDataService) {}
  jsonFileList = new BehaviorSubject<any[]>([]);
  dataChange = new BehaviorSubject<FileNode[]>([]);
  isDataSaved = new BehaviorSubject<boolean>(false);

  readFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const json = JSON.parse(event.target.result);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsText(file);
    });
  }

  async mergeUploadedFiles(files: FileList): Promise<any> {
    const jsonObjects = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const jsonObject = await this.readFile(file);
      jsonObjects.push(jsonObject);
      this.jsonFileList.next(jsonObjects);
    }
    const uniqueObject =
      this.modifyDataService.createUniqueKeysObject(jsonObjects);
    const finalJson = this.modifyDataService.addMissingKeysToAllObjects(
      jsonObjects,
      uniqueObject
    );
    return finalJson;
  }

  currentKeys: any = [];
  updateNestedObject(
    obj: any,
    targetKey: string,
    newValue: any,
    keys: string[] = []
  ): string[] | undefined {
    this.currentKeys = [];

    for (const key in obj) {
      this.currentKeys = [...keys];

      if (typeof obj[key] === 'object') {
        const result = this.updateNestedObject(
          obj[key],
          targetKey,
          newValue,
          this.currentKeys.concat(key)
        );

        if (result !== undefined) {
          return result;
        }
      } else if (key === targetKey) {
        obj[key] = newValue;
        return this.currentKeys.concat(key);
      }
    }

    return undefined;
  }
  downloadJson(jsonObject: any, fileName: string): void {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private values: any[] = [];

  getAllValues(obj: any): any[] {
    this.values = [];
    this.traverse(obj);
    return this.values;
  }

  private traverse(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        // If the current property is an object, recursively call the function
        this.traverse(obj[key]);
      } else {
        // If it's not an object, add its value to the array
        this.values.push(obj[key]);
      }
    }
  }

  merge(data: any[]): any {
    const mergedResult = {};
    data.forEach((obj) => {
      this.mergeNestedObject(mergedResult, obj);
    });
    return mergedResult;
  }

  private mergeNestedObject(target: any, source: any) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];

      if (this.isObject(sourceValue)) {
        target[key] = target[key] || {};
        this.mergeNestedObject(target[key], sourceValue);
      } else {
        target[key] = target[key] || [];
        this.addValueToUniqueArray(target[key], sourceValue);
      }
    });
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  private addValueToUniqueArray(array: any[], value: any) {
    array.push(value);
  }


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
