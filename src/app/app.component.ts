import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthComponent} from "./auth/auth.component";
import {TaskBackService} from "./services/task-back.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showButton = false;

  constructor(private dialog: MatDialog, private taskBackService: TaskBackService) {}

  ngOnInit() {
    this.taskBackService.subscribeToToken().subscribe(result => {
      this.showButton = result;
    })
    if(localStorage.getItem("token") !== '') {
      this.showButton = true;
    }
  }

  authorization() {
    this.dialog.open(AuthComponent, {
      panelClass: 'text-field-dialog',
      width: '30rem',
      height: '300px'
    });
  }

  out() {
    this.taskBackService.setToken('');
  }
}
