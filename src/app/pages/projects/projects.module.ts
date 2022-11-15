import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { UIModule } from '../../shared/ui/ui.module';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule, NgbDatepickerModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProjectgridComponent } from './projectgrid/projectgrid.component';
import { ProjectlistComponent } from './projectlist/projectlist.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ProjectgridComponent, ProjectlistComponent, OverviewComponent, CreateComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    UIModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgApexchartsModule,
    DropzoneModule,
    FormsModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgSelectModule,
  ]
})

export class ProjectsModule { }
