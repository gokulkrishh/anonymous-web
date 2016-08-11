# <img src="https://raw.githubusercontent.com/gokulkrishh/anonymous-web/master/screenshot/logo.png" width="450px" />

> *A <a href="https://facebook.github.io/react/">React</a> powered progressive web application using Firebase Realtime Database.*

# Features

 - Chat instantly with new strangers (no login)

 - Messages sent, typing status

 - One click to close and chat with another stranger

 - Native like application using material design

 - Works both in Android & iOS

*GIF*

<p align="center">
  <img src="https://raw.githubusercontent.com/gokulkrishh/anonymous-web/master/screenshot/anonymous.gif" width="300px">
</p>

*<p align="center">
<a href="https://github.com/gokulkrishh/anonymous-web/blob/master/screenshot/README.md">Screenshots</a>
</p>*

## Build Tools

-  <a href="https://github.com/facebookincubator/create-react-app">Create react app</a>

- <a href="https://getmdl.io">Material design lite</a>

- <a href="https://firebase.google.com/docs/web/setup">Firebase realtime database</a>

- <a href="https://github.com/GoogleChrome/sw-precache">SW precache</a>

- <a href="https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html">Icons generator</a>

*few other utility libraries, check my package.json file*

### Installation

````sh
npm install
````

### Run

````sh
npm run start
````

### Build

````sh
npm run build
````

*Also above command will copy static assets and add it to service-worker.js*

### Deploy

After running `npm run build`, use below command to deploy in gh-pages

````sh
git checkout -B gh-pages
git add -f build
git commit -am "Rebuild website"
git push origin :gh-pages
git subtree push --prefix build origin gh-pages
git checkout -
````



#### MIT Licensed
