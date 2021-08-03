import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { TableTaskComponent } from './table-task/table-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AuthComponent } from './auth/auth.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    TableTaskComponent,
    AddTaskComponent,
    AuthComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatTableModule,
        HttpClientModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatProgressBarModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
