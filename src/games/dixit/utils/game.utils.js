export function calculateScores(G) {
    const voteVals = Object.values(G.votes);
    const masterVotes = voteVals.filter(voteVal => voteVal === G.master[1]);
    const scores = Object.keys(G.scores).reduce((acc, playerId) => {
        const isMasterBusted = masterVotes.length === 0 || (masterVotes.length === Object.keys(G.scores).length - 1);
        if (+playerId === +G.master[0]) {
            if (isMasterBusted) {
                return {
                    ...acc,
                    [playerId]: G.scores[playerId],
                };
            }
            return {
                ...acc,
                [playerId]: G.scores[playerId] + 3,
            };
        }
        const herCards = getCardIds(G.cards, +playerId, G.cardsInHandNr);
        const votesOnHer = Object.values(G.votes).reduce((acc, cardId) => {
            if (herCards.includes(cardId)) {
                return acc + 1;
            }
            return acc;
        }, 0);
        return {
            ...acc,
            [playerId]:  G.scores[playerId] + (isMasterBusted ? 3 : 0) + votesOnHer,
        };
    }, {});
    return scores;
}

export function calculateScoreByPlayerId(G, playerId) {
    if (!playerId) {
        return 0;
    }
    const voteVals = Object.values(G.votes);
    const masterVotes = voteVals.filter(voteVal => voteVal === G.master[1]);
    const isMasterBusted = masterVotes.length === 0 || (masterVotes.length === Object.keys(G.scores).length - 1);
    if (+playerId === +G.master[0]) {
        if (isMasterBusted) {
            return 0
        }
        return 3;
    }
    const herCards = getCardIds(G.cards, +playerId, G.cardsInHandNr);
    const votesOnHer = Object.values(G.votes).reduce((acc, cardId) => {
        if (herCards.includes(cardId)) {
            return acc + 1;
        }
        return acc;
    }, 0);
    return (isMasterBusted ? 3 : 0) + votesOnHer;
}


export function dealCards(G, ctx) {
    let cards = [...G.cards];

    // handle master card replacement
    const masterCardId = G.master[1];
    const masterIndex = G.cards.indexOf(masterCardId);
    cards[masterIndex] = cards[((ctx.numPlayers * G.cardsInHandNr) + ((ctx.numPlayers * ctx.turn) + (G.master[0])))];

    // handle non-master card replacement
    Object.keys(G.tricks).forEach(playerId => {
        const slaveCardId = G.tricks[playerId];
        const slaveIndex = G.cards.indexOf(slaveCardId);
        cards[slaveIndex] = cards[((ctx.numPlayers * G.cardsInHandNr) + ((ctx.numPlayers * ctx.turn) + ((+playerId))))];
    });
    return cards;
}



export function getCardIds(cards, playerID, cardsInHandNr) {
    return cards.filter((card, idx) => (idx >= playerID * cardsInHandNr) && (idx < (playerID + 1) * cardsInHandNr));
}

export function getCardURL(id) {
    return `/assets/img/cards/card_${id.toString().padStart(5, '0')}.jpg`;
}

export function getBackCardURL() {
    return `/assets/img/cards/card_back.jpg`;
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
