import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateJsonTreeComponent } from './translate-json-tree/translate-json-tree.component';


@NgModule({
  declarations: [	
    AppComponent,
   ],
  imports: [
  BrowserModule,
    NoopAnimationsModule,
    TranslateJsonTreeComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
