import { User } from "src/app/core/models/auth.models";

export class Project {
    id?:number;
    description?: string;
    name:string;
    created_by?:any;
    starter_at:any;
    end_date:any;
    assigned_to?:any;
    status?:any;
    matricule?:any;
    constructor(){
        this.id=0;
        this.description='';
        this.name='';
        this.starter_at=null;
        this.end_date=null;
        this.created_by=null;
        this.matricule=null;

    }
}













