const oracledb = require('oracledb')

async function checkConnection(){

    try{
        connection = await oracledb.getConnection({
            user: "csanchez",
            password: "csanchez_icesi2022!",
            connectString: "200.3.193.24:1522/ESTUD"
        });

        console.log('Conectado a la base de datos correctamente');
    }catch(err){
        console.error(err.message);
    
    }finally{
        
        await connection.close();
        console.log('Conexión cerrada correctamente');
    }
}

checkConnection();