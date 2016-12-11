#!/bin/bash

set -e

touch ~/.bashrc
source ~/.bashrc
cd ~

if grep -Fq "Raspbian" /etc/os-release
  then
    echo "Looks like we're setting up a Raspberry pi"
    if [ ! -d ~/.node-install ]
      then
        echo "Downloading and installing Node"
        wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.gz
        tar -xzf node-v4.4.7-linux-armv6l.tar.gz
        mv node-v4.4.7-linux-armv6l nodejs
        rm node-v4.4.7-linux-armv6l.tar.gz
        mv nodejs ${HOME}/.node-install
        mkdir ${HOME}/.npm-packages
        echo $'\n' >> ${HOME}/.bashrc
        echo $'\n' >> ${HOME}/.bashrc
        echo "# Added automatically by canvas setup script" >> ${HOME}/.bashrc
        echo $'\n' >> ${HOME}/.bashrc
        echo NPM_PACKAGES="${HOME}/.npm-packages" >> ${HOME}/.bashrc
        echo NODEJS_PATH="${HOME}/.node-install" >> ${HOME}/.bashrc
        echo prefix=${HOME}/.npm-packages >> ${HOME}/.npmrc
        echo NODE_PATH=\"\$NPM_PACKAGES/lib/node_modules\:\$NODE_PATH\" >> ${HOME}/.bashrc
        echo PATH=\"\$NPM_PACKAGES/bin\:\$PATH\" >> ${HOME}/.bashrc
        echo PATH=\"\$NODEJS_PATH/bin\:\$PATH\" >> ${HOME}/.bashrc
        echo "source ~/.bashrc" >> ${HOME}/.bash_profile
        source ~/.bashrc
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

elif grep -Fq "Debian" /etc/os-release
  then
    echo "Looks like we're setting up a Debian machine"
    echo "Make sure you've run sudo apt-get update && sudo apt-get install build-essential libssl-dev first"
    echo "We're going to try to install node and npm"
    echo "You need to be in sudoers, otherwise this will throw an error"

    sudo apt-get update && sudo apt-get install build-essential libssl-dev git --assume-yes
    curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh -o install_nvm.sh
    bash install_nvm.sh
    source ~/.profile
    export NVM_DIR="/home/canvas/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install 4.4.7
    nvm use 4.4.7
    nvm alias default 4.4.7
    echo "source ~/.bashrc" >> ${HOME}/.bash_profile
fi

if ! type "pod" > /dev/null;
  then
    echo "Installing pod"
    npm install -g pod --assume-yes
fi

if [ ! -d ~/pod ]
  then
    echo "Creating pod directory"
    mkdir ~/pod
fi

echo "Doing default installs now."
# sudo apt-get install espeak --assume-yes

echo "COMPLETE. Now SSH into the device and set up Pod."
