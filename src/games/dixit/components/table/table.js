/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getBackCardURL, getCardURL, calculateScoreByPlayerId, getKeyByValue } from '../../utils/game.utils';
import { CARDS_IN_HAND_NR } from '../../utils/game.constants';
import './table.scss';

export class Table extends React.Component {
    static propTypes = {
        isTrickStage: PropTypes.bool.isRequired,
        faceDownCardNr: PropTypes.number.isRequired,
        isVoteStage: PropTypes.bool.isRequired,
        cardsToVoteFor: PropTypes.array.isRequired,
        vote: PropTypes.func.isRequired,
        isActive: PropTypes.bool.isRequired,
        acknowledgeTurn: PropTypes.func.isRequired,
        isAcknowledgeStage: PropTypes.bool.isRequired,
        master: PropTypes.array.isRequired,
        cards: PropTypes.array.isRequired,
        players: PropTypes.any.isRequired,
        votes: PropTypes.any.isRequired,
        playerID: PropTypes.any.isRequired,
        G: PropTypes.any.isRequired,
    };

    vote = id => {
        this.props.vote(id);
    }

    acknowledgeTurn = () => {
        this.props.acknowledgeTurn();
    }

    getFaceDownCards(faceDownCardNr) {
        return new Array(faceDownCardNr).fill(<img src={getBackCardURL()} className='table-card'/>);
    }

    getPlayerNameByID(id) {
        return this.props.players.find(player => +player.id === +id).name;
    }

    getVotedOnCardNamesById(cardId) {
        const voters = [];
        for (let [key, value] of Object.entries(this.props.votes)) {
            if (value === cardId) {
                voters.push(this.getPlayerNameByID(key))
            }
        }
        return voters.map((voter, idx) => <span>{voter}{idx !== voters.length && <br />}</span>)
    }

    getPlayerNameByCardId(cardId) {
        const { cards, players } = this.props;
        const cardIndex = cards.indexOf(cardId);
        const playerId = Math.floor(cardIndex / CARDS_IN_HAND_NR);
        return players[playerId].name;
    }

    revealCards(cardsToVoteFor, revealMaster, masterId) {
        return cardsToVoteFor.map(id => {
            let playerId;
            if (+id === +masterId) {
                playerId = this.props.G.master[0];
            } else {
                playerId = getKeyByValue(this.props.G.tricks, id)
            }
            return (<div className={'table-card ' + (revealMaster && id === masterId ? 'master' : '')}>
                <img key={id} src={getCardURL(id)} onClick={this.vote.bind(this, id)}/>
                {revealMaster && id === masterId && <div className='overlay'></div>}
                {revealMaster && <div className='players-voted-on-card'>{this.getVotedOnCardNamesById(id)}</div>}
                {revealMaster && <pre className='card-owner'>{this.getPlayerNameByCardId(id)}</pre>}
                {revealMaster && <pre className='card-owner'>{calculateScoreByPlayerId(this.props.G, playerId)}</pre>}
            </div>)
        });
    }

    render() {
        const {isTrickStage, faceDownCardNr, isVoteStage, cardsToVoteFor, isActive, isAcknowledgeStage, acknowledgeTurn, master} = this.props;
        return (
            <div className='table-container'>
                {isActive && isAcknowledgeStage && <button className='acknowledge-button' onClick={acknowledgeTurn}>GET ME TO THE NEXT ROUND</button>}
                <div className='cards-container'>
                    {isTrickStage && this.getFaceDownCards(faceDownCardNr)}
                    {(isVoteStage || isAcknowledgeStage) && this.revealCards(cardsToVoteFor, isAcknowledgeStage, master[1])}
                </div>
                {isAcknowledgeStage && <pre className='you-get-score'>YOU GET: {calculateScoreByPlayerId(this.props.G, +this.props.playerID)}</pre>}
            </div>
        );
    }
}
