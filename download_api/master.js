const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length - 4;
    console.log(`Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.id} crashed. ` +
                'Starting a new worker...');
            cluster.fork();
        }
    });
} else {
    require('./server.js');
}