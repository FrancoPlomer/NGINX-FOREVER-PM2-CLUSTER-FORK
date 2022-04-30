const express = require("express");
const cluster = require("cluster");

const app = express();
const app2 = express();

const numCPUs = require('os').cpus().length

if(cluster.isMaster) {
    console.log(numCPUs);
    console.log(`PID MASTER ${process.pid}`);

    for(let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        console.log('WORKER', worker.process.id, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}
else {
    const PORT = parseInt(process.argv[2]) || 8080

    app.get('/', (req, res) => {
        res.send(`Servidor express en ${PORT}`)
    })

    app2.get('/', (req, res) => {
        res.send(`Servidor express en ${8081}`)
    })

    app.listen(PORT, err => {
        if (!err) console.log("Servidor escuchando")
    })

    app2.listen(8081, err => {
        if (!err) console.log("Servidor escuchando")
    })
}