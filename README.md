# Safe Transactions Proposer

Safe transactions proposer is a module that utilize Safe SDK to make transaction proposal easier for Safe Signer or Delegates. You can clone this repo and use the module to create simple script to propose transactions.

## Problems

- Using Safe SDK require a lot of setup and dependency injections
- There's a lot of boilerplate to do safe action

## Solutions

- Module that wraps the boilerplate and just get to the propose function
- Only need to defined private key

## How to use

Install dependency

```sh
yarn
```

Create and run the script, see examples

```sh
yarn dev examples/1-propose-transactions.ts
```
