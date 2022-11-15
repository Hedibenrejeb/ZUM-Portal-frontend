import { Project } from "src/app/pages/projects/project.model";
import { User } from "./auth.models";
import { Projet } from "./projet";

export class Task {
    id?:number;
    status:string;
    description: string;
    name:string;
    creator?:any;
    enddate:any;
    updatedate?:any;
    createdate?:any;
    startdate:any;
   
    affectedTo?:any;
    project:any; //=> modifier lorsque project done
    constructor(){
        this.status='';
        this.description='';
        this.name='';
        this.project={
           id:0, descreption:'',name:'',starter_at:null, created_by:null,assigned_to:null     
        }; 
        this.enddate=null;
        this.startdate=null;
         this.creator={ id:0 ,firstname:'',lastname: '', email:'', role:''};
        this.affectedTo={id:0 ,firstname:'',lastname: '', email:'', role:''};
 
    }
}
