import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/pages/projects/project.model';
import { environment } from 'src/environments/environment';
import { Projet } from '../models/projet';



@Injectable({ providedIn: 'root' })
export class ProjectService {
  public host=environment.apiUrl;


    // baseurl = "http://localhost:8000/";
    constructor(private http: HttpClient) { }

   

    create(project : Project){
        return this.http.post(`${this.host}/project/add-project/`, project);
    }
    // updateproject(idproject:number ,project:Project):Observable<any>{
    //     return this.http.put(`${this.host}/project/update-project/`+ idproject , project);
    // }
    updateproject(project):Observable<any>{
      return this.http.put(`${this.host}/project/update-project/`+ project.id, project);
  }
    deleteProjects(id){
      console.log("service", id)
      return this.http.delete(`${this.host}/project/delete-project/`+ id);
    }
  public listProject():Observable<Projet[]>{
      return this.http.get<Projet[]>(`${this.host}/project/listproject/`);
  }

  getAll():Observable<any>{
    return this.http.get(`${this.host}/project/list-project/`);
  }
  /// modifier any par model project 
  public addprojectsToLocalCache(projects:any[]):void{
    localStorage.setItem('projects',JSON.stringify(projects));
    }
  
  public getProjectsFromLocalCache():any[]{
      return  JSON.parse( localStorage.getItem('projects')); }
  
  public getListProjectByUser(userId):Observable<any> {
    return this.http.get(`${this.host}/project/GetProjectByUser/` + userId);
    }

  public listProjectByAffectedTo(id:number):Observable<Projet[]>{
      return this.http.get<Projet[]>(`${this.host}/project/GetProjectByUser/${id}`);
    }
    
  public listProjectByCreator(id:number):Observable<Projet[]>{
    return this.http.get<Projet[]>(`${this.host}/project/GetProjectByCreator/${id}`);
  }
  public getProjectById(id:number):Observable<Projet>{
    return this.http.get<Projet>(`${this.host}/project/getproject/${id}`);
  }
  }
  
