import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableTaskComponent } from './table-task/table-task.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { AddTaskComponent } from './add-task/add-task.component';
import { AuthComponent } from './auth/auth.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";

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
        MatProgressBarModule
    ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
