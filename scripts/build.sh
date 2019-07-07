#/bin/bash

BASE_PATH=`cd $(dirname $0);pwd -P`
BASE_PATH=`cd $(dirname $BASE_PATH);pwd -P`

cd $BASE_PATH

npm run build:lp

rm -rf dist

mkdir dist

cp packages/mini-mvvm/dist/mini-mvvm.js dist/mini-mvvm.js
cp packages/mini-mvvm/dist/mini-vdom.js dist/mini-vdom.js