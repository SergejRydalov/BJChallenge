import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SortDirection} from '@angular/material/sort';
import {BehaviorSubject, Observable} from 'rxjs';

export interface TaskApi {
  message: {
    tasks: TaskIssue[];
    total_task_count: number;
  },
  status: string
}

export interface TaskIssue {
  id: number;
  username: string;
  email: string;
  text: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskBackService {

  private newTaskSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private href = 'https://uxcandy.com/~shapoval/test-task-backend/v2/';

  constructor(private http: HttpClient) {}

  subscribeToAddTask() {
    return this.newTaskSubject.asObservable();
  }

  setNewTaskSubject(hasNewTask: boolean) {
    this.newTaskSubject.next(hasNewTask);
  }

  subscribeToToken() {
    return this.tokenSubject.asObservable();
  }

  getTaskSets(sort: string, order: SortDirection, page: number): Observable<TaskApi> {
    const requestUrl = `${this.href}?developer=RSV&sort_field=${sort}&sort_direction=${order}&page=${page+1}`;
    return this.http.get<TaskApi>(requestUrl);
  }

  postNewTask(newTask: FormData): Observable<any> {
    const requestUrl = `${this.href}create?developer=RSV`;
    return this.http.post<any>(requestUrl, newTask);
  }

  postEditTask(id: number, editTask: FormData): Observable<any> {
    const requestUrl = `${this.href}edit/${id}?developer=RSV`;
    return this.http.post<any>(requestUrl, editTask);
  }

  authtorization(auth: FormData): Observable<any> {
    const requestUrl = `${this.href}login?developer=RSV`;
    return this.http.post<any>(requestUrl, auth);
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
    if (localStorage.getItem("token") !== '') {
      this.tokenSubject.next(true);
    } else {
      this.tokenSubject.next(false);
    }
  }
}
