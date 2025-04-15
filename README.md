# Sunrise Sunset BGA implementation
This is an official BGA implementation of [Sunrise Sunset](https://www.perrolokogames.com/en/sunrise-sunset/).
The client code is written in Vue 3 and is combined with the BGA framework during the build process.

# To run the project
## Prerequisite
- node v20+
- npm v11+

## Build
```console
npm install # only the first time
npm run build
```

Sync `dist` dir to BGA server.

## Client testing
With the following command, you can run this project locally without a backend.

```console
npm install # only for the first time
npm start
```

# Project structure
## bga_src
`bga_src` contains all the BGA backend code and a thin layer of BGA client code.

## src
`src` contains main client code written in Vue3.

## public
`public/test.js` contains static test data for running this project offline.
