# Anonymous Chat
*A react based progressive web application*

### WIP

**screenshot:**

## Tools

1. <a href="https://github.com/facebookincubator/create-react-app">create react app</a>

2. <a href="https://github.com/GoogleChrome/sw-precache">sw precache</a>

## Installation

````sh
npm install
````

## Run

````sh
npm run start
````

## Build

````sh
npm run build
````

*copy static assets like images & add it to service-worker.js*

## Deploy

After running `npm run build`, use below command to deploy in gh-pages

````sh
git checkout -B gh-pages
git add -f build
git commit -am "Rebuild website"
git push origin :gh-pages
git subtree push --prefix build origin gh-pages
git checkout -
````
