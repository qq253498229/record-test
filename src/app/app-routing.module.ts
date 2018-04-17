import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecorderComponent} from "./recorder/recorder.component";
import {ChartsComponent} from "./charts/charts.component";
import {Routes, RouterModule} from '@angular/router'
import {DoneComponent} from "./done/done.component";

const routes: Routes = [
  {path: '', redirectTo: '/recorder', pathMatch: 'full'},
  {path: 'recorder', component: RecorderComponent},
  {path: 'charts', component: ChartsComponent},
  {path: 'done', component: DoneComponent}
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
