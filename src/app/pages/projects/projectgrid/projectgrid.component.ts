import { Component, OnInit } from '@angular/core';

import { Project } from '../project.model';

// 
@Component({
  selector: 'app-projectgrid',
  templateUrl: './projectgrid.component.html',
  styleUrls: ['./projectgrid.component.scss']
})

/**
 * Projects-grid component
 */
export class ProjectgridComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  projectData: Project[];

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Grid', active: true }];

    // this.projectData = projectData;
  }

}
