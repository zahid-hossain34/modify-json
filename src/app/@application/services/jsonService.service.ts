import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {

  jsonFileList = new BehaviorSubject<any[]>([]);

   readFile(file: File): Promise<any> {
    console.log(file);
    
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
  
      const mergedObject = this.mergeMultipleJson(jsonObjects);
      return mergedObject;
    }

    private mergeMultipleJson(jsonArray: any[]): any {
      if (jsonArray.length < 2) {
        return jsonArray[0] || {};
      }
  
      const mergedJson = { ...jsonArray[0] };
  
      for (let i = 1; i < jsonArray.length; i++) {
        const currentJson = jsonArray[i];
  
        for (const key in currentJson) {
          console.log('crntjsonkey',key);
          
          if (currentJson.hasOwnProperty(key)) {
            if (mergedJson.hasOwnProperty(key)) {
              if (typeof mergedJson[key] === 'object' && typeof currentJson[key] === 'object') {
                mergedJson[key] = this.deepMergeWithArrays(mergedJson[key], currentJson[key]);
              } else {
                // If the key exists and is not an object, do not overwrite
                
              }
            } else {
              // If the key doesn't exist, add it to the mergedJson
              console.log('currentJson[key]',currentJson[key]);
              
              mergedJson[key] = currentJson[key];
            }
          }
        }
      }
      console.log('mergedJsonaaaa',mergedJson);
      
      return mergedJson;
    }
    deepMergeWithArrays(...objects: any[]): any {
      const merged: Record<string, any> = {};
  
      for (const obj of objects) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              // Recursively merge nested objects
              merged[key] = this.deepMergeWithArrays(merged[key], obj[key]);
            } else {
              // Convert values to arrays and merge
              merged[key] = (merged[key] || []).concat(obj[key]);
            }
          }
        }
      }
  
      return merged;
    }
  
  
    // private mergeJson(json1: any, json2: any): any {
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
    //         console.log('json2[key]',json2[key]);
            
    //         mergedJson[key] = json2[key];
    //       }
    //     }
    //   }
    //   console.log('mergedJsonnested',mergedJson);
      
    //   return mergedJson;
    // }
   currentKeys:any = [];
    updateNestedObject(obj: any, targetKey: string, newValue: any, keys: string[] = []): string[] | undefined {
      console.log(newValue);
      this.currentKeys = [];
 
      for (const key in obj) {
        this.currentKeys = [...keys];
  
        if (typeof obj[key] === 'object') {
          const result = this.updateNestedObject(obj[key], targetKey, newValue, this.currentKeys.concat(key));
  
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
  }
  
