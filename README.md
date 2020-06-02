# RBI CTG: Serverless Homework Question

Use the Serverless framework and our TypeScript boilerplate application to complete the 3 endpoints below. 

## Instructions

Instructions

As part of the interview process we would like you to complete a coding challenge that demonstrates your knowledge of Node and Serverless which our codebase is built on. 

When you complete the challenge you should upload your code to a Github private repo and share with: ([__smchalal__](https://github.com/smchalal), [__abrougher__](https://github.com/abrougher), [__fhern077__](https://github.com/fhern077) or [__ianwsperber__](https://github.com/ianwsperber). We also advise you reply to the initial email with the assignment and confirm you have shared with these users.

## Endpoints (HW Problem)

Additional details can be found in the handlers for each of the below endpoints in [`src/index.ts`](./src/index.ts)

### 1. GET /menu

Return the Popeyes menu
- Update the `menuHandler` in `index.ts`

_Note_: For this first endpoint, we have already defined the endpoint in `serverless.yml`. You only need to update the handler in `src/index.ts`

### 2. GET /cart

Define a new endpoint, `GET /cart`, which returns the user cart enriched with our internal item IDs.
- Add a serverless definition in `serverless.yml`
- Update the `cartHandler` in `index.ts`
  - Use the `plus.json` file to determine the PLU to item ID mapping.

### 3. GET /4pc-chicken/calories

Define a new endpoint, `GET /4pc-chicken/calories`, which returns the min & max calories for a 4 piece chicken combo
- Add a serverless definition in `serverless.yml`
- Update the `calorieCounterHandler` in `index.ts`
  - Compute the min & max calories for the 4pc chicken combo

## Files

To complete the homework, you should only have to touch the below 2-3 files.

*`src/index.ts`*: Entrypoint for our application. Contains all our lambda handler methods.

*`serverless.yml`*: Serverless definition to register our Lambda functions and create HTTP endpoints. For more information see https://serverless.com/framework/docs.

(Optional) *`src/__tests__/index.spec.ts`*: Jest test suite

## Scripts

### Local server

We use the `serverless-offline` plugin to create a local dev server from your `serverless.yml`. By default this will run on http://localhost:3001.

```sh
yarn start
```

This command will build your assets prior to running. The server will _not_ restart automatically for changed assets.

### Tests

We include a basic jest test suite in `src/__tests_/index.spec.ts`.

```sh
yarn test
```

Feel free to add to these tests as you see fit.

### Build

A build command is included to transpile the typescript. The transpiled JavaScript is output to `dist`.

```sh
yarn build
```

_Note_: The `dist` directory will get blown away before every build.
