/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './previous-round.css';

export class PreviousRound extends React.Component {
    static propTypes = {
        previousRound: PropTypes.any.isRequired,
        players: PropTypes.any.isRequired,
    };



    getPlayerNameById(id) {
        return this.props.players.find(player => +player.id === +id).name;
    }

    getCardURL(id) {
        return `/assets/img/cards/card_${id.toString().padStart(5, '0')}.jpg`;
    }

    render() {
        return (
            <div>
                <h2>PREVIOUS ROUND</h2>
                <div><pre>Master ({this.getPlayerNameById(this.props.previousRound.master[0])}):</pre></div>
                <img src={this.getCardURL(this.props.previousRound.master[1])} alt="nope"/>
                <div><h3>Cards given:</h3></div>
                {Object.keys(this.props.previousRound.tricks).filter(x => x && this.props.previousRound.tricks[x]).map(trickPlayerId => <pre><div>Card ({this.getPlayerNameById(trickPlayerId)})</div><img src={this.getCardURL(this.props.previousRound.tricks[trickPlayerId])} alt="nope"/></pre>)}
                <div><h3>Votes:</h3></div>
                {Object.keys(this.props.previousRound.votes).filter(x => x && this.props.previousRound.votes[x]).map(votePlayerId => <pre><div>Card ({this.getPlayerNameById(votePlayerId)}: )</div><img src={this.getCardURL(this.props.previousRound.votes[votePlayerId])} alt="nope"/></pre>)}
            </div>
        );
    }
}
