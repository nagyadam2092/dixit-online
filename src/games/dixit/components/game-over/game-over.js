/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './game-over.scss';

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

export const GameOver = (props) => {
    const scoresArray = Object.keys(props.scores).map(key => ({
        name: props.players.find(player => +player.id === +key).name,
        // name: key,
        score: props.scores[key],
    }));
    const { items, requestSort, sortConfig } = useSortableData(scoresArray);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    return (
        <table>
            <caption>Game Over</caption>
            <thead>
            <tr>
                <th>
                    <button
                        type="button"
                        onClick={() => requestSort('name')}
                        className={getClassNamesFor('name')}
                    >
                        Name
                    </button>
                </th>
                <th>
                    <button
                        type="button"
                        onClick={() => requestSort('score')}
                        className={getClassNamesFor('score')}
                    >
                        Score
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            {items.map((item) => (
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.score}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
