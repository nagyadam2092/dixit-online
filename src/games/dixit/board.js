/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './board.css';

const CARDS_IN_HAND = 6;

export class DixitBoard extends React.Component {
    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string,
        isActive: PropTypes.bool,
        isMultiplayer: PropTypes.bool,
    };

    componentDidMount() {
        console.log(this.props.isActive);
        if (this.props.isActive) {
            this.props.events.setStage('masterChooser');
        } else {
            this.props.events.setStage('noop');
        }
    }

    onClick = id => {
        if (!this.props.isActive) {
            console.log('its not your turn');
            return;
        }
        console.log(id);
        this.props.moves.ChooseCard(id);
        this.props.events.setActivePlayers({
            currentPlayer: 'noop',
            others: 'trickChooser',
        });
        // this.props.events.endTurn();
        // if (this.isActive(id)) {
        //     this.props.moves.clickCell(id);
        // }
    };

    isActive(id) {
        if (!this.props.isActive) return false;
        return true;
    }

    getCardURL(id) {
        return `/assets/img/cards/card_${id.toString().padStart(5, '0')}.jpg`;
    }

    render() {
        console.log(this);
        const playerID = +this.props.playerID;
        const cardIds = this.props.G.cards.filter((card, idx) => (idx >= playerID * CARDS_IN_HAND) && (idx < (playerID + 1) * CARDS_IN_HAND))

        return (
            <div>
                <pre>Turn nr: {this.props.ctx.turn}</pre>
                {this.props.isActive && <h1>Choose a card!</h1>}
                {cardIds.map(id => <img key={id} className="card" src={this.getCardURL(id)} onClick={this.onClick.bind(this, id)}/>)}
            </div>
        );
    }
}
