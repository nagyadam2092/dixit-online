/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './top-menu.scss';

export class TopMenu extends React.Component {
    static propTypes = {
        playerName: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired,
        waitingForNames: PropTypes.string.isRequired,
        currentTurn: PropTypes.string.isRequired,
    };

    render() {
        const {playerName, isActive, waitingForNames, currentTurn} = this.props;
        return (
            <div className='top-menu-container'>
                <div className='top-menu-item player-name'>Welcome, {playerName}</div>
                {currentTurn !== 'acknowledge' && <div className={'top-menu-item player-info ' + (isActive ? 'your-turn': '')}>
                    {isActive && <span>Your turn, choose a card!</span>}
                    {!isActive && waitingForNames && <span title={waitingForNames}>Waiting for other players...</span>}
                </div>}
            </div>
        );
    }
}
