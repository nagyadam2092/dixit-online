// CONSTANTS
const CARDS_IN_HAND_NR = 6;
const CARDS_TOTAL_NR = 102;

// UTILS
function calculateScores(G) {
    const voteVals = Object.values(G.votes);
    const masterVotes = voteVals.filter(voteVal => voteVal === G.master[1]);
    const scores = Object.keys(G.scores).reduce((acc, playerId) => {
        if (masterVotes.length === 0 || masterVotes.length === Object.keys(G.scores).length - 1) {
            if (+playerId === +G.master[0]) {
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
        return {
            ...acc,
            [playerId]: G.scores[playerId] + Object.values(G.votes).filter(voterId => +voterId === +playerId).length,
        };
    }, {});
    return scores;
}

function dealCards(G, ctx) {
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

// MOVES

function SetMasterCard(G, ctx, id) {
    return {
        ...G,
        master: [+ctx.currentPlayer, id],
        cardsToVoteFor: [id],
    };
}

function TrickCard(G, ctx, cardId, playerId) {
    return {
        ...G,
        tricks: {
            ...G.tricks,
            [playerId]: cardId,
        },
        cardsToVoteFor: ctx.random.Shuffle([
            ...G.cardsToVoteFor,
            cardId,
        ]),
    };
}

function VoteOnCard(G, ctx, cardId, playerId) {
    return {
        ...G,
        votes: {
            ...G.votes,
            [playerId]: cardId,
        }
    };
}

// GAME DEFINITION

export const Dixit = {
    name: 'dixit',

    setup: (ctx) => {
        const tricksVotesEmptyObj = ctx.playOrder.reduce((acc, player) => {
            acc[player] = null;
            return acc;
        }, {});
        const scoresEmptyObj = ctx.playOrder.reduce((acc, player) => {
            acc[player] = 0;
            return acc;
        }, {});
        return {
            cards: ctx.random.Shuffle(Array.from(Array(CARDS_TOTAL_NR).keys())),
            master: [],
            tricks: tricksVotesEmptyObj,
            votes: tricksVotesEmptyObj,
            scores: scoresEmptyObj,
            cardsToVoteFor: [],
            turn: 'masterChooser',
            cardsInHandNr: CARDS_IN_HAND_NR,
            lastRound: null,
        }
    },

    turn: {
        onBegin: (G, ctx) => {
            ctx.events.setActivePlayers({
                currentPlayer: {stage: 'masterChooser'},
                moveLimit: 1,
            });
            return G;
        },
        stages: {
            masterChooser: {
                moves: {
                    SetMasterCard,
                },
                // moveLimit: 1,
                next: 'trickChooser'
            },
            trickChooser: {
                moves: {
                    TrickCard,
                },
                moveLimit: 1,
                next: 'vote'
            },
            vote: {
                moves: {
                    VoteOnCard,
                },
                moveLimit: 1,
            },
        },
        onMove: (G, ctx) => {
            if (ctx.activePlayers === null) {
                const newTurn = G.turn === 'masterChooser' ? 'trickChooser' : G.turn === 'trickChooser' ? 'vote' : null;
                ctx.events.setActivePlayers({
                    others: newTurn,
                    moveLimit: 1,
                });
                return {
                    ...G,
                    turn: newTurn,
                }
            }
            return G;
        },
        onEnd: (G, ctx) => {
            const tricksVotesEmptyObj = ctx.playOrder.reduce((acc, player) => {
                acc[player] = null;
                return acc;
            }, {});
            const scores = calculateScores(G);
            const cards = dealCards(G, ctx);
            const lastRound = {
                ...G,
            };

            return {
                ...G,
                master: [],
                tricks: tricksVotesEmptyObj,
                votes: tricksVotesEmptyObj,
                cardsToVoteFor: [],
                turn: 'masterChooser',
                scores,
                cards,
                lastRound,
            };
        },
        endIf: (G, ctx) => {
            return Object.keys(G.votes)
                .filter((key) => +key !== +ctx.currentPlayer)
                .every(key => G.votes[key] !== null);
        }
    },

    onEnd: (G, ctx) => {
        return G;
    },

    endIf: (G, ctx) => {
        return ctx.turn === 10;
    }
};
