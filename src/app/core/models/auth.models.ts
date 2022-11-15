export class User {
    id?:number ;
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
    password?:string
    constructor(){
        this.id=0;
        this.firstname='';
        this.lastname='';
        this.email='';
        this.role='';
    }
}
