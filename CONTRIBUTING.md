# Contributing guide

1. create an issue to discuss the change
2. create a PR if change makes sense after the discussion
3. PR review + merge!

## package manager

Use `yarn`, do not create package-lock.json from npm

## code lint

The repo uses **eslint** and **prettier** to enforce some style and lint rules. Make sure that `yarn lint` runs successfully on your branch.

## Local project setup

### library setup

1. clone the repo (of your fork) in a separate folder
2. run `yarn` in the root directory
3. run `yarn build` in the root directory

(this should create a `dist` folder)

### test app setup

1. open or create a new react native project (expo and RN CLI both work)
2. add a dependency in package.json like

```json
{
  "dependencies": {
    "react-native-youtube-iframe": "path/to/cloned/folder"
  }
}
```

3. run the app and use the iframe as stated in the docs

### making changes

1. make a change in the cloned folder
2. run `yarn build`
3. reload / refresh test app
