import * as express from 'express'
import { makeExecutableSchema } from 'graphql-tools'
import { applyMiddleware } from 'graphql-middleware'
import { importSchema } from 'graphql-import'
// This cannot use ES6 import w/ typescript due to bug
const { ApolloServer } = require('apollo-server-express')

import { getUserInfo, permissions } from './auth'
import resolvers from './resolvers'

// Environment

const env = {
  region: process.env.FUNCTION_REGION,
  projectId: process.env.GCP_PROJECT,
  functionName: process.env.FUNCTION_NAME,
}

// GraphQL Uploads supported only in node v8 or higher

const gqlUploadsEnabled = process.version.substring(0, 2) === 'v8'

// Schema Processing

const typeDefs = importSchema('./src/schema.graphql')
const schema = makeExecutableSchema({ typeDefs, resolvers })
const schemaWithAuth = applyMiddleware(schema, permissions)

// Apollo Server Configuration

const server = new ApolloServer({
  schema: schemaWithAuth,
  context: ({ req }) => ({
    ...req,
    user: getUserInfo(req),
  }),
  uploads: gqlUploadsEnabled,
  introspection: true,
  tracing: true,
  playground: {
    endpoint: `https://${env.region}-${env.projectId}.cloudfunctions.net/${
      env.functionName
    }/graphql`,
  },
})

// App and Routes

const app = express()
server.applyMiddleware({ app })

app.get('/nodeversion', function(req, res) {
  res.send(process.version)
})

app.get('/dbtest', async function(req, res) {
  console.log('Database Test')
})

export const api = (req: any, res: any) => {
  console.log('Route: ' + req.originalUrl)
  app(req, res)
}
