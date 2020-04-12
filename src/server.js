import { Server, FlatFile } from 'boardgame.io/server';
import { TicTacToe } from './games/tictactoe/game';
import { Dixit } from './games/dixit/game';
const path = require('path');
const appDir = path.dirname(require.main.filename);
const server = Server({
    games: [ TicTacToe, Dixit ],
    // db: new FlatFile({
    //     dir: `${appDir}/../db`,
    //     logging: true,
    // }),
});


server.run(8000);
