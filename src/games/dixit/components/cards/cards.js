import React from 'react';
import PropTypes from 'prop-types';
import './cards.scss';
import { getCardIds, getCardURL } from '../../utils/game.utils';

export class Cards extends React.Component {
    static propTypes = {
        cards: PropTypes.any.isRequired,
        click: PropTypes.func.isRequired,
        playerID: PropTypes.any.isRequired,
        cardsInHandNr: PropTypes.any.isRequired,
    };

    onClick = id => {
        this.props.click(id);
    };

    render() {
        const cardIds = getCardIds(this.props.cards, +this.props.playerID, this.props.cardsInHandNr);

        return (
            <div className='cards'>
                {cardIds.map(id => (
                    <div className='card' onClick={this.onClick.bind(this, id)} key={id}>
                        <div className='card-face' style={{backgroundImage: getCardURL(id)}}>
                            <div className='card-label'>
                                {/*{id}*/}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            // cardIds.map(id => <div key={id} className='card' style={{backgroundImage: `url(${getCardURL(id)})`}} onClick={this.onClick.bind(this, id)}></div>)
        );
    }
}
