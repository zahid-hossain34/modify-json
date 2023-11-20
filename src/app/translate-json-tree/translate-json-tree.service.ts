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

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = JSON.stringify({
  Applications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir'
    },
    Sun: 'png',
    Woods: 'jpg'
  }
});


@Injectable({
  providedIn: 'root',
})
export class TranslateJsonTreeService {

  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    // file node as children.
    
    const data = this.buildFileTree(dataObject, 0);

    // console.log('data',data);
    

    // Notify the change.
    this.dataChange.next(data);
  }

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

