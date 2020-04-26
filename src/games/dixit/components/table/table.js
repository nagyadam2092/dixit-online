/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getBackCardURL, getCardURL } from "../../utils/game.utils";
import "./table.scss";

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
    };

    vote = id => {
        this.props.vote(id);
    }

    acknowledgeTurn = () => {
        this.props.acknowledgeTurn();
    }

    getFaceDownCards(faceDownCardNr) {
        return new Array(faceDownCardNr).fill(<img src={getBackCardURL()} className="table-card"/>);
    }

    revealCards(cardsToVoteFor, revealMaster, masterId) {
        console.log(...arguments);
        return cardsToVoteFor.map(id => <img key={id} className={"table-card " + (revealMaster && id === masterId ? "master" : "")} src={getCardURL(id)} onClick={this.vote.bind(this, id)}/>);
    }

    render() {
        const {isTrickStage, faceDownCardNr, isVoteStage, cardsToVoteFor, isActive, isAcknowledgeStage, acknowledgeTurn, master} = this.props;
        return (
            <div className="table-container">
                {isActive && isAcknowledgeStage && <button className="acknowledge-button" onClick={acknowledgeTurn}>GET ME TO THE NEXT ROUND</button>}
                <div className="cards-container">
                    {isTrickStage && this.getFaceDownCards(faceDownCardNr)}
                    {(isVoteStage || isAcknowledgeStage) && this.revealCards(cardsToVoteFor, isAcknowledgeStage, master[1])}
                </div>
            </div>
        );
    }
}
