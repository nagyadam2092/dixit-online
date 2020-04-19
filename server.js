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


import { Server } from 'boardgame.io/server';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import { Dixit } from './src/games/dixit/game';

const server = Server({ games: [Dixit] });
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');

// Serve the build directory
const static_pages = new Koa();
static_pages.use(serve(frontEndAppBuildPath));
server.app.use(mount('/', static_pages));
server.run(PORT, () => {
    server.app.use(
        async (ctx, next) => await serve(frontEndAppBuildPath)(
            Object.assign(ctx, { path: 'index.html' }),
            next
        )
    )
});
