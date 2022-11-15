import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DndModule } from 'ngx-drag-drop';
import { NgbDropdownModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { TasksRoutingModule } from './tasks-routing.module';
import { UIModule } from '../../shared/ui/ui.module';

import { ListComponent } from './list/list.component';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { CreatetaskComponent } from './createtask/createtask.component';
import { ListTaskComponent } from './list-task/list-task.component';
import {   NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { UpdatetaskComponent } from './updatetask/updatetask.component';

@NgModule({
  declarations: [ListComponent, KanbanboardComponent, CreatetaskComponent, ListTaskComponent, UpdatetaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    UIModule,
    NgApexchartsModule,
    NgbDatepickerModule,
    NgbModalModule,
    CKEditorModule,
    DndModule,    
    NgbPaginationModule,

    NgbDropdownModule
  ]
})
export class TasksModule { }
