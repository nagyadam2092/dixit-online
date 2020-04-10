// function MasterChooser(G, ctx, id) {
//     console.log('ChooseCard', G, ctx, id);
// }
// function TrickChooser(G, ctx, id) {
//     console.log('ChooseCard', G, ctx, id);
// }

function ChooseCard(G, ctx, id) {
    console.log('ChooseCard', G, ctx, id);
    return {
        ...G,
        master: ctx.playOrderPos === 0 ? id : G.master,
        tricks: ctx.playOrderPos > 0 ? {} : G.tricks,
    };
}

function VoteOnCard(G, ctx) {
    console.log('VoteOnCard', G, ctx);
}

function Noop(G, ctx) {
    console.log('Noop', G, ctx);
}

export const Dixit = {
    name: "dixit",

    setup: (ctx) => {
        console.log(ctx);
        return {
            cards: ctx.random.Shuffle(Array.from(Array(100).keys())),
            master: null,
            tricks: ctx.playOrder.reduce((acc, player) => {
                console.log(player, acc);
                acc[player] = null;
                return acc;
            }, {}),
        }
    },

    // phases: {
    //     choose: {
    //         moves: {
    //             MasterChooser,
    //         }
    //     },
    //     vote: {
    //         moves: {
    //             VoteOnCard,
    //         }
    //     }
    //
    // },

    turn: {
        stages: {
            masterChooser: {
                moves: {
                    ChooseCard,
                },
            },
            trickChooser: {
                moves: {
                    ChooseCard
                }
            },
            noop: {
                moves: {
                    Noop,
                }
            },
            vote: {
                moves: {
                    VoteOnCard,
                }
            },
        }
    },

    // moves: {
    //     // clickCell(G, ctx, id) {
    //     //     if (G.cells[id] === null) {
    //     //         G.cells[id] = ctx.currentPlayer;
    //     //     }
    //     // }
    // },

    // turn: { moveLimit: 1 },

    onEnd: (G, ctx) => {
        // TODO calculate scores;
    },

    endIf: (G, ctx) => {
        console.log(ctx);
        return ctx.turn === 10;
    }
};
