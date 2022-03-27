const oracledb = require('oracledb')
const express = require('express')
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

var connectionData = {
    user:'csanchez',
    password: 'nomecopies',
    connectionString: '200.3.193.24:1522/ESTUD'
}

async function selectAllFabricas(req, res){

    try{

        connection = await oracledb.getConnection(connectionData);
        result = await connection.execute('Select * from fabricas');

    }catch(err){
        return res.send(err.message)
    }finally{

        await connection.close();

        if(result.rows.length == 0){
            return res.send('La consulta no generó resultados')

        }else{
            return res.send(result.rows)
        }
    }
}

async function selectFabricaById(req, res, id){
    try{

        connection = await oracledb.getConnection(connectionData);
        result = await connection.execute('Select * from fabricas where fabrica_id = :id', [id]);


    }catch(err){
        return res.send(err.message)
    }finally{

        await connection.close();

        if(result.rows.length == 0){
            return res.send('La consulta no generó resultados')

        }else{
            return res.send(result.rows)
        }

    }
}

async function createFabrica(req, res){
    try{

        var body = req.body


        connection = await oracledb.getConnection(connectionData);
        //result = await connection.execute('INSERT INTO fabricas VALUES (:id, :nombre, :ciudad)', [body.id, body.nombre, body.ciudad], {autoCommit: true});
        result = await connection.execute('INSERT INTO fabricas VALUES (:id, :nombre, :ciudad)', [body.id, body.nombre, body.ciudad], {autoCommit: true}, function(err, result){
            if(err){
                //Error
                res.set('content-Type', 'application/json');
                res.status(400).send(JSON.stringify({
                    status:400,
                    message: err.message
                }))
            }else{
                res.status(201).set('Location', '/addFabrica' + req.body.id).end();
            }
        });


    }catch(err){
        res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
            status:500,
            message: "Error conectando a la bd"
        }));
        return
    }finally{

        await connection.close();
        //res.status(201).set('Location', '/addFabrica' + req.body.id).end();

    }
}


//Obtener todas las fabricas
app.get('/fabricas', function(req, res){
    selectAllFabricas(req, res);
})

//Obtener una fábrica
//get /fabrica?id=<id fabrica>
app.get('/fabrica', function(req, res){
    let id = req.query.id
    if(isNaN(id)){
        return res.send('El query parámetro no es un número')
        
    }
    selectFabricaById(req, res, id);
})

//Crear una nueva fabrica
app.post('/addFabrica', function(req, res){
    createFabrica(req, res)

})


app.listen(port, ()=> console.log("App running on port ", port));