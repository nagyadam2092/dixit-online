/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './last-round.css';

export class LastRound extends React.Component {
    static propTypes = {
        lastRound: PropTypes.any.isRequired,
        players: PropTypes.any.isRequired,
    };



    getPlayerNameById(id) {
        return this.props.players.find(player => +player.id === +id).name;
    }

    getCardURL(id) {
        console.log(id);
        // return id;
        // if (id === null) {
        //     return
        // }
        return `/assets/img/cards/card_${id.toString().padStart(5, '0')}.jpg`;
    }

    render() {
        const lastRound = JSON.stringify(this.props.lastRound);

        return (
            <div>
                <h1>LAST ROUND</h1>
                <pre>Master ({this.getPlayerNameById(this.props.lastRound.master[0])}): <img src={this.getCardURL(this.props.lastRound.master[1])} alt="nope"/></pre>
                Cards given: {Object.keys(this.props.lastRound.tricks).filter(x => x && this.props.lastRound.tricks[x]).map(trickPlayerId => <pre>Card ({this.getPlayerNameById(trickPlayerId)})<img src={this.getCardURL(this.props.lastRound.tricks[trickPlayerId])} alt="nope"/></pre>)}
                {/*Votes: {Object.keys(this.props.lastRound.votes).map(votePlayerId => <pre>Card ({this.getPlayerNameById(votePlayerId)}: )<img src={this.getCardURL(this.props.lastRound.votes[votePlayerId])} alt="nope"/></pre>)}*/}
                <pre>{lastRound}</pre>
            </div>
        );
    }
}
