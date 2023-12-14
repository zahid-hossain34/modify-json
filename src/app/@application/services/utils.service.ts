import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}



  /**
   * 
   * @param obj1  
   * @param obj2  
   * @returns  the merged object of obj1 and obj2 
   */
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

  /**
   * 
   * @param obj  
   * @returns  the object with all the keys of obj and empty string as the default value 
   */

  private getUniqueKeys(obj: any): any {
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

  /**
   * 
   * @param data  
   * @returns  the object with all the keys of obj and empty string as the default value
   */
  createUniqueKeysObject(data: any[]): any {
    return data.reduce(
      (acc, obj) => this.mergeObjects(acc, this.getUniqueKeys(obj)),
      {}
    );
  }

  /**
   * 
   * @param obj  
   * @param mergedObject  
   * @returns  the object with all the keys of mergedObject and values of obj 
   * if the key is present in obj otherwise the value of mergedObject
   */
  private applyValuesToObject(obj: any, mergedObject: any): any {
    const result = { ...mergedObject };
    for (const key in mergedObject) {
      if (mergedObject.hasOwnProperty(key)) {
        result[key] = obj[key] !== undefined ? obj[key] : mergedObject[key];
      }
    }
    return result;
  }

  /**
   * 
   * @param data   
   * @param mergedObject  
   * @returns  the array of objects with all the keys of mergedObject and values of obj 
   * if the key is present in obj otherwise the value of mergedObject
   */

  applyValuesToMergedObject(data: any[], mergedObject: any): any[] {
    return data.map((obj) => this.applyValuesToObject(obj, mergedObject));
  }

  /**
   * 
   * @param obj  
   * @param mergedObject  
   * @returns  the object with all the keys of obj and values of mergedObject  
   */

  private addMissingKeysToObject(obj: any, mergedObject: any): any {
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

  /**
   * 
   * @param data 
   * @param mergedObject 
   * @returns  the array of objects with all the keys of obj and values of mergedObject  
   */

  addMissingKeysToAllObjects(data: any[], mergedObject: any): any[] {
    return data.map((obj) => this.addMissingKeysToObject(obj, mergedObject));
  }
 /**
  * 
  * @param value 
  * @returns  true if the value is an object otherwise false 
  */
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  /**
   * 
   * @param array 
   * @param value 
   * @returns  the array with the value added to it 
   */
  addValueToUniqueArray(array: any[], value: any) {
    array.push(value);
  }
}
