// UTILS
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
                [playerId]: G.scores[playerId] + 2,
            };
        }
        const votesOnHer = Object.keys(G.votes).reduce((acc, pId) => {
            const herCards = getCardIds(G.cards, +pId, G.cardsInHandNr);
            if (herCards.includes(G.votes[pId])) {
                return acc + 1;
            }
            return acc;
        }, 0);
        return {
            ...acc,
            [playerId]:  G.scores[playerId] + (isMasterBusted ? 2 : 0) + votesOnHer,
        };
    }, {});
    debugger;
    return scores;
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
