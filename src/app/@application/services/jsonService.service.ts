import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode } from '../interfaces/base.interface';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class JsonServiceService {
  constructor(private utilsService: UtilsService) {}
  jsonFileList = new BehaviorSubject<any[]>([]);
  dataChange = new BehaviorSubject<FileNode[]>([]);
  currentKeys: any = [];
  private values: any[] = [];

  /**
   *
   * @param file is the uploaded file
   * @returns  the promise of the JSON object of the uploaded file
   */
  private readFile(file: File): Promise<any> {
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
  
  /**
   *
   * @param files is the list of uploaded files
   * @returns  the promise of the merged JSON object of the uploaded files
   */
  async mergeUploadedFiles(files: FileList): Promise<any> {
    const jsonObjects = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const jsonObject = await this.readFile(file);
      jsonObjects.push(jsonObject);
      this.jsonFileList.next(jsonObjects);
    }
    const uniqueObject = this.utilsService.createUniqueKeysObject(jsonObjects);
    const finalJson = this.utilsService.addMissingKeysToAllObjects(
      jsonObjects,
      uniqueObject
    );
    return finalJson;
  }

  /**
   *
   * @param obj is the JSON object of the uploaded file
   * @returns  the array of values of the JSON object
   */
  getAllValues(obj: any): any[] {
    this.values = [];
    this.traverse(obj);
    return this.values;
  }

/**
 * 
 * @param obj is the JSON object of the uploaded file  
 * @returns  the array of values of the JSON object  
 */
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

  /**
   *
   * @param data is the array of JSON objects of the uploaded files
   * @returns  the merged JSON object of the uploaded files
   */
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

      if (this.utilsService.isObject(sourceValue)) {
        target[key] = target[key] || {};
        this.mergeNestedObject(target[key], sourceValue);
      } else {
        target[key] = target[key] || [];
        this.utilsService.addValueToUniqueArray(target[key], sourceValue);
      }
    });
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

  /**
   *
   * @param obj is the JSON object of the uploaded file
   * @param targetKey   is the key to be added to the JSON object
   * @param newValue  is the value to be added to the JSON object
   * @param keys  is the array of keys of the JSON object initially it is empty array
   * @returns   the array of keys of the JSON object
   */
  updateIndividualObject(
    obj: any,
    targetKey: string,
    newValue: any,
    keys: string[] = []
  ): string[] | undefined {
    this.currentKeys = [];

    for (const key in obj) {
      this.currentKeys = [...keys];

      if (typeof obj[key] === 'object') {
        const result = this.updateIndividualObject(
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

  /**
   *
   * @param jsonObject is the JSON object of the uploaded file
   * @param fileName  is the name of the file to be downloaded
   * @returns  the downloaded file
   */
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
}
