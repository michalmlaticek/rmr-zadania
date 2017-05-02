import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, NavigationExtras } from '@angular/router';

import { AppComponent } from './app.component';
import { OdometriaComponent } from './odometria/odometria.component';
import { NavigaciaComponent } from './navigacia/navigacia.component';
import { MapovanieComponent } from './mapovanie/mapovanie.component';
import { TrajektoriaComponent } from './trajektoria/trajektoria.component';
import { NavComponent } from './nav/nav.component';

import { MoveDataService, ScanDataService, MapDataService, DoorService } from './services';

// Routes
const appRoutes: Routes = [
  { path: 'odometria', component: OdometriaComponent },
  { path: 'navigacia', component: NavigaciaComponent },
  { path: 'mapovanie', component: MapovanieComponent },
  { path: 'trajektoria', component: TrajektoriaComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    OdometriaComponent,
    NavigaciaComponent,
    MapovanieComponent,
    TrajektoriaComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MoveDataService, ScanDataService, MapDataService, DoorService],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
