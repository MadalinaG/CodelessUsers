import { Department } from './department';

export class User {
    id: string;
    name: string;
    birthday: string;
    departments: Department[];

    
    constructor(id, name, birthday, departments){
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.departments = departments;
    }

  
    
}
