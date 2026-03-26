#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd "/home/frederic/Desktop/Learn/online-document-hub/online doc hub frontend"
npm install tailwindcss@^3.4.0 postcss@^8.4.21 autoprefixer@^10.4.14 --save
BROWSER=none npm start
