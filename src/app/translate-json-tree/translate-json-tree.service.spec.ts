/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateJsonTreeService } from './translate-json-tree.service';

describe('Service: TranslateJsonTree', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateJsonTreeService]
    });
  });

  it('should ...', inject([TranslateJsonTreeService], (service: TranslateJsonTreeService) => {
    expect(service).toBeTruthy();
  }));
});
