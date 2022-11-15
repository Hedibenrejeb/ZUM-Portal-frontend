import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { CreatetaskComponent } from './createtask/createtask.component';
import { ListTaskComponent } from './list-task/list-task.component';
import { UpdatetaskComponent } from './updatetask/updatetask.component';

const routes: Routes = [
    {
        path: 'updateTask/:id',
        component: UpdatetaskComponent
    },
    {
        path: 'list',
        component: ListComponent
    },
    {
        path: 'list/:id',
        component: ListComponent
    },
    {
        path: 'kanban',
        component: KanbanboardComponent
    },
    {
        path: 'listTasks',
        component: ListTaskComponent
    },
    {
        path: 'create',
        component: CreatetaskComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksRoutingModule { }
