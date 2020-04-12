function SetMasterCard(G, ctx, id) {
    return {
        ...G,
        master: id,
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
            cards: ctx.random.Shuffle(Array.from(Array(100).keys())),
            master: null,
            tricks: tricksVotesEmptyObj,
            votes: tricksVotesEmptyObj,
            scores: scoresEmptyObj,
            cardsToVoteFor: [],
            turn: 'masterChooser',
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


            // TODO deal 1 (different) new card to everyone
            // TODO update scores
            return {
                ...G,
                master: null,
                tricks: tricksVotesEmptyObj,
                votes: tricksVotesEmptyObj,
                cardsToVoteFor: [],
                turn: 'masterChooser'
            };
        },
        endIf: (G, ctx) => {
            return Object.keys(G.votes)
                .filter((key) => +key !== +ctx.currentPlayer)
                .every(key => G.votes[key] !== null);
        }
    },

    onEnd: (G, ctx) => {
        // TODO calculate scores;
        return G;
    },

    endIf: (G, ctx) => {
        return ctx.turn === 10;
    }
};
