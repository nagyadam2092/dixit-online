import { calculateScores, dealCards } from './utils/game.utils';
import { CARDS_IN_HAND_NR, CARDS_TOTAL_NR, TURN_NR } from './utils/game.constants';

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

function AcknowledgeTurn(G) {
    console.log('Acknowledging turn', G);
    return G;
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
            previousRound: null,
            gameOver: false,
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
                next: 'acknowledge',
            },
            acknowledge: {
                moves: {
                    AcknowledgeTurn,
                },
                moveLimit: 1,
            }
        },
        onMove: (G, ctx) => {
            if (ctx.activePlayers === null) {
                const newTurn = G.turn === 'masterChooser' ? 'trickChooser' : G.turn === 'trickChooser' ? 'vote' : G.turn === 'vote' ? 'acknowledge' : null;
                console.log('newTurn', newTurn);
                if (G.turn === 'vote') {
                    ctx.events.setActivePlayers({
                        all: newTurn,
                        moveLimit: 1,
                    });
                } else if (G.turn !== 'acknowledge') {
                    ctx.events.setActivePlayers({
                        others: newTurn,
                        moveLimit: 1,
                    });
                }
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
            const previousRound = {
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
                previousRound,
            };
        },
        endIf: (G, ctx) => {
            return (ctx.activePlayers === null && G.turn === null) || (ctx.activePlayers && Object.values(ctx.activePlayers).every(turn => turn === null) && G.turn === null);
        }
    },

    onEnd: (G, ctx) => {
        return {
            ...G,
            gameOver: true,
        };
    },

    endIf: (G, ctx) => {
        return ctx.turn === TURN_NR;
    }
};
