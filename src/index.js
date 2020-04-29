/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Dixit } from "./games/dixit/game";
import { DixitBoard } from "./games/dixit/components/board/board";
import { Lobby } from 'boardgame.io/react';
import './index.css';
const DixitClient = Client({
    game: Dixit,
    board: DixitBoard,
    debug: true,
    multiplayer: SocketIO({ server: "localhost:8000" })
});
const importedGames = [{
    game: Dixit,
    board: DixitBoard,
}];

const server = `https://${window.location.hostname}`;
const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

class App extends React.Component {
    state = { playerID: null };

    render() {
        if (this.state.playerID === null) {
            return (
                <div className='frontpage'>
                    <div className="container">
                        <img src="https://3.bp.blogspot.com/-3Ueu7NWuelI/WhsLvGfxt0I/AAAAAAAAVHc/todoDa7OV5sgKnhy8dkw0DuxFZuphHIdQCLcBGAs/s640/Dixit_Banner.png" alt=""/>
                        <div className="logo">
                            <a href="/" title="Home" rel="home" className="notranslate logo">
                                <i>&gt;</i><b>keylight</b><i>/</i>
                            </a>
                            &nbsp;
                            edition
                        </div>
                        <Lobby
                            gameServer={server}
                            lobbyServer={server}
                            gameComponents={importedGames}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div>
                <DixitClient playerID={this.state.playerID} />
            </div>
        );
    }
}

render(<App />, document.getElementById("root"));
