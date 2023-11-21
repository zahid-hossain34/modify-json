import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { TranslatePageComponent } from './translate-page/translate-page.component';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    TranslatePageComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
