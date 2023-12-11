/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModifyDataService } from './modify-data.service';

describe('Service: ModifyData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModifyDataService]
    });
  });

  it('should ...', inject([ModifyDataService], (service: ModifyDataService) => {
    expect(service).toBeTruthy();
  }));
});
