/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Cards } from '../cards/cards';
import './board.scss';
import { PreviousRound } from "../previous-round/previous-round";
import { getCardIds } from '../../utils/game.utils';
import { TopMenu } from "../top-menu/top-menu";
import { Table } from "../table/table";

export class DixitBoard extends React.Component {
    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string,
        isActive: PropTypes.bool,
        isMultiplayer: PropTypes.bool,
    };
    state = {
        message: '',
    };

    onClick = id => {
        if (!this.props.isActive) {
            this.promptMessage('IT IS NOT YOUR TURN !!!');
            return;
        }
        if (this.isMasterPlayer(this.props.ctx, this.props.playerID)) {
            this.props.moves.SetMasterCard(id);
        } else if (this.isTrickingPlayer(this.props.ctx, this.props.playerID)) {
            this.props.moves.TrickCard(id, this.props.playerID);
        }
    };

    vote = id => {
        if (!this.props.isActive) {
            this.promptMessage('IT IS NOT YOUR TURN !!!');
            return;
        }
        const cardIds = getCardIds(this.props.G.cards, +this.props.playerID, this.props.G.cardsInHandNr);
        if (cardIds.includes(id)) {
            this.promptMessage('CAN NOT CHOOSE YOUR OWN CARD !!!');
            return;
        }
        this.props.moves.VoteOnCard(id, this.props.playerID);
    }

    acknowledgeTurn() {
        console.log(this);
        this.props.moves.AcknowledgeTurn();
    }

    isMasterPlayer(ctx, id) {
        return ctx.activePlayers && ctx.activePlayers[id] === 'masterChooser';
    }

    isTrickingPlayer(ctx, id) {
        return ctx.activePlayers && ctx.activePlayers[id] === 'trickChooser';
    }

    isVotingPlayer(ctx, id) {
        return ctx.activePlayers && ctx.activePlayers[id] === 'vote';
    }

    isVoteStage() {
        return this.props.ctx.activePlayers && Object.values(this.props.ctx.activePlayers)
            .every(stage => stage === 'vote');
    }

    isTrickStage() {
        return this.props.ctx.activePlayers && Object.values(this.props.ctx.activePlayers)
            .every(stage => stage === 'trickChooser');
    }

    isAcknowledgeStage() {
        return this.props.ctx.activePlayers && Object.values(this.props.ctx.activePlayers)
            .every(stage => stage === 'acknowledge');
    }

    currentTurn() {
        return this.props.ctx.activePlayers && Object.values(this.props.ctx.activePlayers)[0];
    }

    getScores() {
        return (<div>
            <pre>{JSON.stringify(this.getScoresWithNames(), null, 2)}</pre>
        </div>);
    }

    getScoresWithNames() {
        const enrichedScores = {};
        for (let id in this.props.G.scores) {
            enrichedScores[this.getPlayerNameByID(id)] = this.props.G.scores[id];
        }
        return enrichedScores;
    }

    getCurrentPlayerName() {
        return this.getPlayerNameByID(this.props.playerID);
    }

    getPlayerNameByID(id) {
        return this.props.gameMetadata.find(player => +player.id === +id).name;
    }

    getWaitingForNames() {
        return this.props.ctx.activePlayers && Object.keys(this.props.ctx.activePlayers).map(id => this.getPlayerNameByID(id)).join(',');
    }

    promptMessage(message) {
        this.setState({
            message,
        });
        setTimeout(() => {
            this.setState({
                message: '',
            });
        }, 3000)
    }

    emptyMessage() {
        this.setState({
            message: '',
        });
    }

    getPutDownCardsNr() {
        return this.props.gameMetadata.length - Object.keys(this.props.ctx.activePlayers).length;
    }

    render() {
        const {isActive} = this.props;
        const name = this.getCurrentPlayerName();
        console.log(this.props.G);

        return (
            <div className="game-container">
                <TopMenu playerName={name} isActive={this.props.isActive} currentTurn={this.currentTurn()}
                         waitingForNames={this.getWaitingForNames()}/>
                {this.state.message && <div className="jqbox_overlay" onClick={this.emptyMessage.bind(this)}></div>}
                {this.state.message && <h1 className="jqbox_innerhtml">{this.state.message}</h1>}
                <pre className="scores">Scores: {this.getScores()}
                    Turn nr: {this.props.ctx.turn}
                </pre>
                <div className="game-table">
                    <Table isTrickStage={this.isTrickStage()} faceDownCardNr={this.getPutDownCardsNr()}
                           isVoteStage={this.isVoteStage()} cardsToVoteFor={this.props.G.cardsToVoteFor}
                           vote={this.vote} isActive={isActive} acknowledgeTurn={this.acknowledgeTurn.bind(this)}
                           isAcknowledgeStage={this.isAcknowledgeStage()} master={this.props.G.master}
                           cards={this.props.G.cards} players={this.props.gameMetadata}/>
                    <Cards cards={this.props.G.cards} playerID={+this.props.playerID}
                           cardsInHandNr={this.props.G.cardsInHandNr} click={this.onClick}/>
                </div>
            </div>
        );
    }
}
