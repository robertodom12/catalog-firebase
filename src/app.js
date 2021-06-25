import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {router} from './api/routes.js'
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


const httpServer = createServer(app);
const io = new Server(httpServer,{  cors: {
    origins: ['http://localhost:4200']
  }});
app.get('/', (req, res) => res.send('App is working'))
app.use('/api',router);

io.on('connection',function(socket) {
    console.log('NEW CLIENT')
    socket.on('pdfTask',function(data) {
        console.log(data);
    })
})

var server = httpServer.listen(process.env.PORT || 3000, function(){
    console.log(`Backend run on port ${server.address().port}`);
})


export {
    app,
    io
}
