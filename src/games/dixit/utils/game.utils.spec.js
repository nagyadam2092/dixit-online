import { calculateScores, dealCards } from './game.utils';

// players: 0,1,2,3
// prev scores: 0{5}, 1{6}, 2{7}, 3{8}
// master: 2, masterCard: 12
// cards: 0{10}, 1{11}, 2{12}, 3{13}
// votes: 0 --> 11, 1 --> 12, 3 --> 10
//
// expected scores:
// 0: 5+1=6, 1: 6+1=7, 2: 2+7=9, 3: 0+8=8

it('should return good scores', () => {
    const G = {
        master: [2, 12],
        scores: {
            '0': 5,
            '1': 6,
            '2': 7,
            '3': 8,
        },
        votes: {
            '0': 11,
            '1': 12,
            '3': 10,
        },
        cards: [
            10,101,102,103,104,105,
            11,106,107,108,109,110,
            12,111,112,113,114,115,
            13,116,117,118,119,120,
        ],
    };
    const expected = {
        '0': 6,
        '1': 7,
        '2': 9,
        '3': 8,
    };
    expect(calculateScores(G)).toEqual(expected);
});
