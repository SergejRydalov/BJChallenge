import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {TaskBackService} from '../services/task-back.service'
import {merge, of as observableOf, Subscription} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatCheckboxChange} from "@angular/material/checkbox";
import {AuthComponent} from "../auth/auth.component";
import {MatDialog} from "@angular/material/dialog";


export interface TaskIssue {
  id: number;
  username: string;
  email: string;
  text: string;
  status: number;
}

@Component({
  selector: 'app-table-task',
  templateUrl: './table-task.component.html',
  styleUrls: ['./table-task.component.scss']
})
export class TableTaskComponent implements AfterViewInit,OnInit, OnDestroy {

  private changeTaskList$: Subscription;
  private changeToken$: Subscription;
  private changeTask$: Subscription;
  private changeSort$: Subscription;


  displayedColumns: string[] = [];

  data: TaskIssue[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  idEdit = '';
  text?: string;
  showButton = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('editTextAria') editTextAria: ElementRef;


  constructor(private taskBackService: TaskBackService, private dialog: MatDialog) {}

  ngOnInit() {
    this.changeTaskList$ = this.taskBackService.subscribeToAddTask().subscribe(result => {
      if (result === true) {
        this.ngAfterViewInit();
      }
    });
    this.changeToken$ = this.taskBackService.subscribeToToken().subscribe(result => {
      this.showButton = result;
      this.changeDisplayedColumns();
    });
    (localStorage.getItem("token")) ? this.showButton = true : this.showButton = false;
    this.changeDisplayedColumns();
  }

  ngAfterViewInit() {

    this.changeSort$ = this.sort.sortChange.subscribe(() => this.paginator.pageIndex);
    merge(this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.taskBackService!.getTaskSets(
          this.sort.active, this.sort.direction, this.paginator.pageIndex)
          .pipe(catchError(() => observableOf(null)));
      }),
      map(data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;
        if (data === null) {
          return [];
        }
        this.resultsLength = data.message.total_task_count;
        this.endEdit();
        return data.message.tasks;
      })
    ).subscribe(result =>  this.data = result);
  }

  startEdit(id: string) {
    this.idEdit = id;
    setTimeout(() => {
      this.editTextAria.nativeElement.focus()
    }, 0);

  }

  endEdit() {
    this.idEdit = '';
  }

  changeDisplayedColumns() {
    if (this.showButton) {
      this.displayedColumns = ['username', 'email', 'text', 'status', 'actions']
    } else {
      this.displayedColumns = ['username', 'email', 'text', 'status']
    }
  }

  editTask(id: number, text: string, status: number) {
    const formData: FormData = new FormData();
    formData.append('token', <any>localStorage.getItem("token"));
    formData.append('text', text);
    formData.append('status', status.toString());
    this.changeTask$ = this.taskBackService!.postEditTask(id, formData).subscribe(task => {
      if (task.status === "ok") {
        this.taskBackService.setNewTaskSubject(true);
      } else {
        this.dialog.open(AuthComponent, {
          panelClass: 'text-field-dialog',
          width: '30rem',
          height: '300px',
        });
      }
    })
  }

  checked(event: MatCheckboxChange, id: number, text: string) {
    let status: number;
    (event.checked) ? status = 11 : status = 1;
    this.editTask(id, text, status);
  }

  ngOnDestroy(){
    this.changeTaskList$.unsubscribe();
    this.changeToken$.unsubscribe();
    this.changeTask$.unsubscribe()
    this.changeSort$.unsubscribe()
  }
}

