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
            // this.props.events.setStage('masterChooser');
            // this.props.events.setActivePlayers({
            //     currentPlayer: {stage: 'masterChooser'},
            // });
        }
    }

    onClick = id => {
        if (!this.props.isActive) {
            console.log('its not your turn');
            return;
        }
        if (this.props.isActive) {
            if (this.isMasterPlayer(this.props.ctx, this.props.playerID)) {
                this.props.moves.SetMasterCard(id);
                // this.props.events.setActivePlayers({
                //     others: 'trickChooser',
                //     moveLimit: 1,
                // });
            } else if (this.isTrickingPlayer(this.props.ctx, this.props.playerID)) {
                console.log('trying to trick');
                this.props.moves.TrickCard(id, this.props.playerID);
                console.log('this.props.G.tricks', this.props.G.tricks);
                console.log('Object.values(this.props.G.tricks).filter(x => x).length === this.props.ctx.numPlayers - 2', Object.values(this.props.G.tricks).filter(x => x).length === this.props.ctx.numPlayers - 2);
                // if (Object.values(this.props.G.tricks).filter(x => x).length === this.props.ctx.numPlayers - 2) {
                //     console.log('SETTING ACTIVE PLAYERS');
                //     this.props.events.endStage();
                //     // this.props.events.setActivePlayers({
                //     //     others: 'vote',
                //     //     moveLimit: 1,
                //     // });
                // }
                // this.props.events.setActivePlayers({
                //     others: 'vote',
                // });
                // if (this.shouldTrickStageEnd(this.props.G.tricks)) {
                //     this.props.events.endStage();
                // }
            } else if (this.isVotingPlayer(this.props.ctx, this.props.playerID)) {
                this.props.moves.VoteOnCard(id, this.props.playerID);
                // if (this.props.ctx.activePlayers === null) {
                //     this.props.events.setActivePlayers({
                //         others: 'vote',
                //         moveLimit: 1,
                //     });
                // }
                // if (this.shouldVoteStageEnd(this.props.G.votes)) {
                //     console.log('please end stage');
                //     this.props.events.endStage();
                //     console.log('please end turn');
                //     this.props.events.endTurn();
                // }
            }
        }
        // this.props.events.endTurn();
        // if (this.isActive(id)) {
        //     this.props.moves.clickCell(id);
        // }
    };

    isMasterPlayer(ctx, id) {
        return ctx.activePlayers && ctx.activePlayers[id] === 'masterChooser';
    }

    isTrickingPlayer(ctx, id) {
        return ctx.activePlayers && ctx.activePlayers[id] === 'trickChooser';
    }

    isVotingPlayer(ctx, id) {
        return ctx.activePlayers && ctx.activePlayers[id] === 'vote';
    }

    // shouldTrickStageEnd(tricks) {
    //     return Object.values(tricks)
    //         .filter((trick, idx) => idx > 0)
    //         .every(trick => trick !== null);
    // }
    //
    // shouldVoteStageEnd(votes) {
    //     return Object.values(votes)
    //         .filter((vote, idx) => idx > 0)
    //         .every(vote => vote !== null);
    // }

    isVoteStage() {
        // return false;
        console.log(this.props.ctx);
        return this.props.ctx.activePlayers && Object.values(this.props.ctx.activePlayers)
            .every(stage => stage === 'vote');
    }

    isActive(id) {
        if (!this.props.isActive) return false;
        return true;
    }

    getCardURL(id) {
        return `/assets/img/cards/card_${id.toString().padStart(5, '0')}.jpg`;
    }

    render() {
        console.log(this);
        console.log('this.props.isActive', this.props.isActive);
        console.log('this.props.ctx.activePlayers', this.props.ctx.activePlayers);
        const name = this.props.gameMetadata.find(player => +player.id === +this.props.playerID).name;
        const playerID = +this.props.playerID;
        const cardIds = this.props.G.cards.filter((card, idx) => (idx >= playerID * CARDS_IN_HAND) && (idx < (playerID + 1) * CARDS_IN_HAND))

        return (
            <div>
                <pre>{name}</pre>
                <pre>Turn nr: {this.props.ctx.turn}</pre>
                {this.props.isActive && <h1>Choose a card!</h1>}
                {this.isVoteStage() && <div>
                    <h1>LET'S VOTE</h1>
                    {this.props.G.cardsToVoteFor.map(id => <img key={id} className="card" src={this.getCardURL(id)} onClick={this.onClick.bind(this, id)}/>)}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>}
                {cardIds.map(id => <img key={id} className="card" src={this.getCardURL(id)} onClick={this.onClick.bind(this, id)}/>)}
            </div>
        );
    }
}
