import { User } from "./auth.models";
export class Projet {
    id?:number;
    description: string;
    name:string;
    created_by:User;
    starter_at:Date;
    assigned_to?:any;

    constructor(){
        this.id=0;
        this.description='';
        this.name='';
        this.starter_at=null;
        this.created_by={ id:0 ,firstname:'',lastname: '', email:'', role:''};


    }
}
