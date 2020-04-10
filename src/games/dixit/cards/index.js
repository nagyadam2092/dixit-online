const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const cardsDir = `${appDir}/../public/assets/img/cards`;

export const cards = fs.readdirSync(cardsDir);

