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
import { DixitBoard } from "./games/dixit/board";
import { Lobby } from 'boardgame.io/react';
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

class App extends React.Component {
    state = { playerID: null };

    render() {
        if (this.state.playerID === null) {
            return (
                <div>
                    <Lobby
                        gameServer={`http://${window.location.hostname}:8000`}
                        lobbyServer={`http://${window.location.hostname}:8000`}
                        gameComponents={importedGames}
                    />
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
