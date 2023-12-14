/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JsonTreePageComponent } from './json-tree-page.component';

describe('JsonTreePageComponent', () => {
  let component: JsonTreePageComponent;
  let fixture: ComponentFixture<JsonTreePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonTreePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonTreePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
