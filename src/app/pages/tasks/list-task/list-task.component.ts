import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from 'src/app/core/models/task.models';
// import {MatPaginatorModule} from '@angular/material/paginator';
@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
})
export class ListTaskComponent implements OnInit {
tasks:Task[]=[];



page = 1;


  constructor(private taskServ:TaskService) { }

  ngOnInit(): void {
    this.getTasks()
  }

  public getTasks(): void {
    this.taskServ.listTask().subscribe(
      (response:Task[]) => {
          console.log("refresh after delete")
          this.tasks=response
           
      }, (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }
    )

    
  }

}
