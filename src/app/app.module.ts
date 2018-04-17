import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {NgxEchartsModule} from 'ngx-echarts';
import {RecorderComponent} from './recorder/recorder.component';
import {ChartsComponent} from './charts/charts.component'
import {AppRoutingModule} from "./app-routing.module";
import { DoneComponent } from './done/done.component';

@NgModule({
  declarations: [
    AppComponent,
    RecorderComponent,
    ChartsComponent,
    DoneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxEchartsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
