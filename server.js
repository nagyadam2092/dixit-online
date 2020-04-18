// import { Server, FlatFile } from 'boardgame.io/server';
// import { TicTacToe } from './src/games/tictactoe/game';
// import { Dixit } from './src/games/dixit/game';
// const path = require('path');
// const appDir = path.dirname(require.main.filename);
// const server = Server({
//     games: [ TicTacToe, Dixit ],
//     // db: new FlatFile({
//     //     dir: `${appDir}/../db`,
//     //     logging: true,
//     // }),
// });
//
//
// server.run(8000);
// console.log('PLS HEROKU PLSSSSS');

var http = require('http');

//create a server object:
http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
