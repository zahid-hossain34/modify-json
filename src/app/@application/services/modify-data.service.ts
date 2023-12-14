import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModifyDataService {
  constructor() {}

  mergeObjects(obj1: any, obj2: any): any {
    const result = { ...obj1 };
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (
          obj1.hasOwnProperty(key) &&
          typeof obj1[key] === 'object' &&
          typeof obj2[key] === 'object'
        ) {
          result[key] = this.mergeObjects(obj1[key], obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      }
    }
    return result;
  }

  getUniqueKeys(obj: any): any {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
        result[key] = this.getUniqueKeys(obj[key]);
      } else {
        result[key] = ''; // Use an empty string as the default value
      }
    }
    return result;
  }

  createUniqueKeysObject(data: any[]): any {
    return data.reduce(
      (acc, obj) => this.mergeObjects(acc, this.getUniqueKeys(obj)),
      {}
    );
  }

  applyValuesToObject(obj: any, mergedObject: any): any {
    const result = { ...mergedObject };
    for (const key in mergedObject) {
      if (mergedObject.hasOwnProperty(key)) {
        result[key] = obj[key] !== undefined ? obj[key] : mergedObject[key];
      }
    }
    return result;
  }

  applyValuesToMergedObject(data: any[], mergedObject: any): any[] {
    return data.map((obj) => this.applyValuesToObject(obj, mergedObject));
  }

  addMissingKeysToObject(obj: any, mergedObject: any): any {
    const result = { ...obj };
    for (const key in mergedObject) {
      if (
        mergedObject.hasOwnProperty(key) &&
        (obj[key] === undefined || obj[key] === null)
      ) {
        result[key] = mergedObject[key];
      }
      if (
        mergedObject[key] !== undefined &&
        typeof mergedObject[key] === 'object' &&
        obj[key] !== undefined &&
        typeof obj[key] === 'object'
      ) {
        result[key] = this.addMissingKeysToObject(obj[key], mergedObject[key]);
      }
    }
    return result;
  }

  addMissingKeysToAllObjects(data: any[], mergedObject: any): any[] {
    return data.map((obj) => this.addMissingKeysToObject(obj, mergedObject));
  }
}
