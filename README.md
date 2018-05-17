<p align="center"><img src="https://i.imgur.com/QChDq1R.png" title="Serverless GraphQL eCommerce platform" alt="CommerceQL" /></p>

CommerceQL is a minimalist eCommerce [GraphQL](https://prismagraphql.com) boilerplate.

[Documentation](https://docs.commerceql.com) • [Website](https://commerceql.com) • [Slack](https://slack.commerceql.com)

## Contents

* [Setup](#setup)
* [Configure](#config)
* [Development](#dev)
* [Deploy](#deploy)
* [Usage](#usage)
* [Sponsors](#sponsors)

## <a name="setup"></a>Setup

You will need to be running the latest version of `graphql-cli`, `prisma` and have a [Prisma](https://prismagraphql.com) account too.

```bash
npm install -g graphql-cli prisma
graphql create my-commerce-app --boilerplate commerceql/commerceql
cd my-commerce-app
npm run dev
```

## <a name="config"></a>Configure

The setup above should take care of configuring your `ENV` with your Prisma endpoint. You'll want to configure Stripe so you can begin to take payments using the `checkout` mutation.

Go ahead and add your `STRIPE_SECRET_KEY` inside `.env`.

⚠️ Note: This boilerplate doesn't handle auth. You'll want to protect the `order/s` queries.

## <a name="dev"></a>Development

CommerceQL can be used to build a custom GraphQL backed eCommerce app, without the limitations of hosted solutions.

You can extend the CommerceQL platform by adding additional functions, types and permissions, or you can use it "as is" and start selling 💰.

## <a name="deploy"></a>Deploy

You can immediately deploy "as is" to [Zeit Now](https://now.sh) using the preconfigured `now.json`. You'll want to add your `alias` to this file for easier deployment.

If you make any changes to the schema or resolvers, you'll want to run `prisma deploy` to update your prisma sandbox.

## Usage

Once you're up and running, locally with `npml run dev` or deployed to `now` you can start to run the provided queries, mutations and subscriptions.

## <a name="sponsors"></a>Sponsors

❤️ This project is sponsored by [Moltin](https://moltin.com).
