import { openDatabase } from "expo-sqlite";
import { Plane } from "../Model/Plane";
import { insert } from "./server";


const database = openDatabase("movieDb");

/*
    name: string;
    status: string;
    size: number;
    owner: string; 
    manufacturer: string;
    capacity: number;
*/

const createTable = (): void => {
    database.transaction(tx => {
        tx.executeSql("create table if not exists planes(id integer, name text, status text, size number, owner text, manufacturer text, capacity int);", [])
    })
}

export const getAllLocal = async (): Promise<Plane[]> => {
    createTable();
    console.log("getAllLocal");
    return new Promise((resolve, reject) => {
        database.transaction(tx => tx.executeSql(
            "select * from planes",
            [],
            (tx, results) => {
               
                let rows: any = results.rows;
                let planes: Plane[] = [];
                rows._array.forEach((elem: any) => {
                    planes.push(new Plane(elem.id, elem.name, elem.status, elem.size, elem.owner, elem.manufacturer, elem.capacity))
                });

                resolve(planes);
            },
        ));
    })
}

export const insertLocal = (plane: Plane) => {
    console.log("insertlocal");
    return database.transaction(tx => tx.executeSql(
        "insert into planes(id, name, status, size, owner, manufacturer, capacity) values (?,?,?,?,?,?,?)",
        [plane.id, plane.name, plane.status, plane.size, plane.owner, plane.manufacturer, plane.capacity]
    ))

}

export const syncServerToLocal = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        database.transaction(tx => tx.executeSql(
            "select * from planes where id = ?",
            [-1],
            (tx, results) => {
                let rows: any = results.rows;
                let planes: Plane[] = [];
                rows._array.forEach((elem: any) => {
                    planes.push(new Plane(elem.id, elem.name, elem.status, elem.size, elem.owner, elem.manufacturer, elem.capacity))
                   
                });
                planes.forEach(p => {
                    insert(p).then((data: any)=>data.json().then(d=>console.log("sync", d)))
                })
                resolve();
            },
        ));    
    })
    
}

const dropTable = () => {
    console.log("drop table");
    database.transaction(tx => tx.executeSql("delete from planes"))
}

export const syncLocalToServer = (planes: Plane[]) => {
    dropTable();
    console.log("sync local to server")
    planes.forEach(p => insertLocal(p));
}