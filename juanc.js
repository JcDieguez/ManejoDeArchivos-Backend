const fs = require('fs');

class Contenedor {
        constructor(file){
            this.file = file;
        }


        writeFile = async data => {
            try {
                await fs.promises.writeFile(
                    this.file, JSON.stringify(data, null, 2)
                )

            } catch (error) {
                console.log(`error: ${error}`);
            }
        }

        getAll = async() => {
            try {
                const productos = await fs.promises.readFile(this.file, 'utf-8');
                return JSON.parse(productos);
                
            } catch (error) {
                if(error.message.includes('no hay tal archivo o directorio')) return [];
                console.log(`error: ${error}`);                
            }
        }

        save = async obj => {
            let productos = this.getAll();
            try {
                let newId;
                productos.length === 0 ? newId = 1 : newId = productos[productos.length-1].id + 1;
                let newObj = {...obj, id: newId};
                productos.push(newObj);
                await this.writeFile(productos);
                return newObj.id;
            } catch (error) {
                console.log(`error de save: ${error}`);
            }
        }

        getById = async id => {
            let productos = await this.getAll();
            try {

                const obj = productos.find(id => productos.id === id);
                return obj ? obj : null;
            } catch (error) {
                console.log(`error: ${error}`);
            }
        }

        deleteById = async id => {
            let productos = await this.getAll();
            try {
                const obj = productos.find(id => productos.id === id);
                await this.writeFile(productos);
            } catch (error) {
                console.log(`error: ${error}`);
            }
        }

        deleteAll = async() => {
            this.writeFile([]);
        }
}

const products = new Contenedor('products.txt')

const test = async () => {
    let save = await products.save({
        title: 'Telefono',
        price: 423.56,
        thumbnail: 'asd@gmail.com'
    });


    let getAll = await products.getAll();
    console.log(getAll);

    let getById = await products.getById(5);
    console.log(getById);

    let deleteById = await products.deleteById(2);
    console.log(deleteById);

    let deleteAll = await products.deleteAll();
    console.log(deleteAll);
};

test ();