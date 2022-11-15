import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../models/task.models';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public host=environment.apiUrl;

  constructor(private http:HttpClient) { }


public listTask():Observable<Task[]>{
    return this.http.get<Task[]>(`${this.host}/task/gettasks`);
}

public listTaskByCreator(id:number):Observable<Task[]>{
  return this.http.get<Task[]>(`${this.host}/task/TaskByCreator/${id}`);
}

public listTaskByAffectedTo(id:number):Observable<Task[]>{
  return this.http.get<Task[]>(`${this.host}/task/TaskByUser/${id}`);
}
public listTaskByProject(id:number):Observable<Task[]>{
  return this.http.get<Task[]>(`${this.host}/task/TaskByProject/${id}`);
}



public addTask(task:Task):Observable<Task>{
  return this.http.post<Task>(`${this.host}/task/addTask`,task);
} 

public updateTask(id:number,task:Task):Observable<Task>{
  return this.http.put<Task>(`${this.host}/task/update/${id}`, task);
}

public deleteTask(id:number) {
  return this.http.delete(`${this.host}/task/delete/${id}`);
}
public allTask():Observable<Task[]>{
  return this.http.get<Task[]>(`${this.host}/task/listask/`);
}

}
