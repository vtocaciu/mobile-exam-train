export class Plane {
    id: number;
    name: string;
    status: string;
    size: number;
    owner: string; 
    manufacturer: string;
    capacity: number;

    constructor(id: number, name: string, status: string, size: number, owner: string, manufacturer: string, capacity: number){
        this.id = id;
        this.name = name;
        this.status = status;
        this.size = size;
        this.owner = owner;
        this.manufacturer = manufacturer;
        this.capacity = capacity;
    }
}