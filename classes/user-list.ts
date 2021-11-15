import { User } from "./user";

export class UserList {
    private userList: User[] = [];

    constructor() {}

    public add(user: User) {
        this.userList.push(user);
        console.log(this.userList);
        
        return user;
    }

    public update(id: string, name: string) {
        for (let user of this.userList) {
            if (user.id === id) {
                user.name = name;
                break;
            }
        }

        console.log('==== Actualizando usuario ====');
        console.log(this.userList);
    }

    public list() {
        return this.userList.filter(user => user.name !== 'no-name');
    }

    public get(id: string) {
        return this.userList.find(user => user.id === id);
    }

    public listByRoom(room: string) {
        return this.userList.filter(user => user.room === room);
    }

    public delete(id: string) {
        const userTemp = this.get(id);
        this.userList = this.userList.filter(user => user.id !== id);

        return userTemp;
    }
}