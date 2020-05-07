# The Ethereum Billboard

This is the code for 'The Ethereum Billboard' site that I made back in 2018 to experiment with Ethereum+IPFS. In summary, it allows users to post any image on the 'billboard' (a smart contract), if they can outbid the last user's bid. As time goes by, the price goes down to better price the ad spot. Additionally, it rewards users who have posted ads already with a divident of new ad revenue (weighted by how many ads have been posted by them)

## Motivation

The Ethereum Billboard was made for two core reasons: to test out the capabilities of Ethereum and IPFS in regards to creating digital scarcity in media, but most importantly to carry out a social experiment that lies at the intersection of conceptual art, cutting edge tech, and a discussion of issues relevant to our times. On the billboard, you can pay some Ether to display anything you want, as long as you pay more than the last person. I want to explore themes of crypto economics, free speech, and human nature. I had no idea how this was going to turn out, but I was very curious about the message that the “winning ads” would send. Put your ether where your mouth is!

After running the experiment, it was mainly used for sharing crypto memes, personal promotion, and for ongoing twitter beefs. It was very fun :)

Inspired by the million dollar homepage.

## Components

- NodeJS server. Serves the frontend, connects to the IPFS gateway for *adding new pictures*, and if you choose it, connects to a mongoDB instance for counting views.

- Frontend in /public. It's a barebones vanillaJS+HTMl+CSS frontend that also workds on mobile. It has the following bundled libraries, that I built with browserify: ipfs.js, zeroProvider(taken from metamask), socketIO, web3, and a byte<->ipfs hash conversion tool.

- Tools in */tools*. These is the source code of the libraries used in the frontend. 

- Solidity Smart Contract, in */smart contract*. The abi goes in the source code for the front end /public/js/bitscreen/contractdetails.js

## Running

Note: server requires nodeJS.
The IPFS gateway requires IPFS https://ipfs.io/docs/install/

npm install

node app < ipfs gateway url/ip > < ipfs gateway port > < optional: mongo connection ULR >

Make sure that you have deployed the smart contract and put its ABI in /public/js/bitscreen/contractdetails.js

## TODO / Next steps

The front end severely needs to be rebuilt using a modern framework like react. The process of using libraries via browserify is painful and makes updating them a chore.

If you try running it right now, you will get some errors. This is due to the bundled web3 being outdated. I also suspect that the IPFS library is outdated. This is the source of the security concerns on npm and github.

In the original design, there was no app server. I wanted it to be a complete dapp. Unfortunately, back then, the IPFS library did not allow adding of content from the browser, so I had to have a nodeJS app server for that. If this feature now exists, then the server can be removed. Unfortunately, the view counting feature would have to be removed too, or perhaps offloaded to another service like google analytics.


