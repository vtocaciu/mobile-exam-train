import { Plane } from "../Model/Plane";

const ip = "192.168.1.9";
const port = "1876";

const url = `http://${ip}:${port}`

export const getAll = (): Promise<Plane[]> => {
    console.log("getAll");
    return new Promise((resolve, reject) => {
        fetch(`${url}/all`)
            .then(unformatedData =>
                unformatedData.json()
                    .then(data => {
                        let planes: Plane[] = [];
                        data.forEach((element: any, key: number) => {
                            //console.log(element, key) 
                            planes.push(new Plane(element.id, element.name, element.status, element.size, element.owner, element.manufacturer, element.capacity))
                        });
                        resolve(planes);
                    }))
            .catch(error => reject(error));
        setTimeout(() => reject("server offline"), 3000);
    })

}

export const getByOwner = (): Promise<Plane[]> => {
    console.log("getByOwner");
    return new Promise((resolve, reject) => {
        fetch(`${url}/my/eu`)
            .then(unformatedData =>
                unformatedData.json()
                    .then(data => {
                        let planes: Plane[] = [];
                        data.forEach((element: any, key: number) => {
                            //console.log(element, key) 
                            planes.push(new Plane(element.id, element.name, element.status, element.size, element.owner, element.manufacturer, element.capacity))
                        });
                        resolve(planes);
                    }))
            .catch(error => reject(error));
        setTimeout(() => reject("server offline"), 3000);
    })
}

export const insert = (plane: Plane) => {
    return new Promise((resolve, reject) => {
        fetch(`${url}/plane`, {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(plane)
        }).then(data=>resolve(data));
        setTimeout(() => reject("server offline"), 3000);
    });
}