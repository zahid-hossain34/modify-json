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
}
