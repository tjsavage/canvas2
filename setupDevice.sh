#!/bin/bash

set -e

touch ~/.bashrc
source ~/.bashrc
cd ~
if [ ! -d ~/.nodejs ]
  then
    echo "Downloading and installing Node"
    wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.gz
    tar -xzf node-v4.4.7-linux-armv6l.tar.gz
    mv node-v4.4.7-linux-armv6l nodejs
    rm node-v4.4.7-linux-armv6l.tar.gz
    mv nodejs ${HOME}/.node-install
    mkdir ${HOME}/.npm-packages
    echo NPM_PACKAGES="${HOME}/.npm-packages" >> ${HOME}/.bashrc
    echo NODEJS_PATH="${HOME}/.node-install" >> ${HOME}/.bashrc
    echo prefix=${HOME}/.npm-packages >> ${HOME}/.npmrc
    echo NODE_PATH=\"\$NPM_PACKAGES/lib/node_modules\:\$NODE_PATH\" >> ${HOME}/.bashrc
    echo PATH=\"\$NPM_PACKAGES/bin\:\$PATH\" >> ${HOME}/.bashrc
    echo PATH=\"\$NODEJS_PATH/bin\:\$PATH\" >> ${HOME}/.bashrc
    echo source "~/.bashrc" >> ${HOME}/.bash_profile
fi

if ! type "npm" > /dev/null;
  then
    echo "Setting up local path"
    NPM_PACKAGES="${HOME}/.npm-packages"
    NODEJS_PATH="${HOME}/.node-install"
    NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
    PATH="$NPM_PACKAGES/bin:$PATH"
    PATH="$NODEJS_PATH/bin:$PATH"
fi

echo $PATH
npm install -g pod
