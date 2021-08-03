import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TaskBackService} from '../services/task-back.service';
import {Subscriber, Subscription} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  auth$: Subscription;
  changeValue$: Subscription;

  submitted = false;
  errorAuth = false;
  formAuth: FormGroup;
  login: string;
  password: string;

  constructor(private taskBackService: TaskBackService, public dialogRef: MatDialogRef<AuthComponent>, @Inject(MAT_DIALOG_DATA) public data: AuthComponent) { }

  ngOnInit(): void {
    this.formAuth = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  close() {
    this.dialogRef.close();
  }

  submitAuth() {
    const formData: FormData = new FormData();
    formData.append('username', this.formAuth.get('login')?.value);
    formData.append('password', this.formAuth.get('password')?.value);

    if(this.formAuth.valid) {
      this.submitted = false;
      this.auth$ = this.taskBackService!.authtorization(formData).subscribe(result => {
        if (result.status === "ok") {
          this.formAuth.reset();
          this.taskBackService.setToken(result.message.token);
          this.dialogRef.close();
        } else {
          this.errorAuth = true;;
          this.changeValue$ = this.formAuth.valueChanges.subscribe(changeValue => {
            this.errorAuth = false;
          })
        }
      })
    } else {
      this.submitted = true;
    }
  }

  ngOnDestroy () {
    this.auth$.unsubscribe();
    this.changeValue$.unsubscribe();
  }

}
