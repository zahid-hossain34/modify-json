/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JsonTreeComponent } from './json-tree.component';

describe('JsonTreeComponent', () => {
  let component: JsonTreeComponent;
  let fixture: ComponentFixture<JsonTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
