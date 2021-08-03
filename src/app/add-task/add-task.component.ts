import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskBackService} from '../services/task-back.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, OnDestroy {
  showFormAddTask = false;
  submitted = false;
  showMessage = false;
  formAddTask: FormGroup;
  newTask$: Subscription;

  constructor(private taskBackService: TaskBackService) { }

  ngOnInit(): void {
    this.formAddTask = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      name: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required)
    })
  }

  addTask() {
    const formData: FormData = new FormData();
    formData.append('username', this.formAddTask.get('name')?.value);
    formData.append('email', this.formAddTask.get('email')?.value);
    formData.append('text', this.formAddTask.get('text')?.value);

    if(this.formAddTask.valid) {
      this.submitted = false;
      this.newTask$ = this.taskBackService!.postNewTask(formData).subscribe(task => {
        if (task.status === "ok") {
          this.taskBackService.setNewTaskSubject(true);
          this.formAddTask.reset();
          this.showMessage = true;
          setTimeout(() => this.showMessage = false, 4000);
        }
      })
    } else {
      this.submitted = true;
    }
  }

  ngOnDestroy() {
    this.newTask$.unsubscribe();
  }

}
