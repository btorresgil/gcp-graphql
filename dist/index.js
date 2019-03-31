"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphql_tools_1 = require("graphql-tools");
const graphql_middleware_1 = require("graphql-middleware");
const graphql_import_1 = require("graphql-import");
// This cannot use ES6 import w/ typescript due to bug
const { ApolloServer } = require('apollo-server-express');
const auth_1 = require("./auth");
const resolvers_1 = require("./resolvers");
// Environment
const env = {
    region: process.env.FUNCTION_REGION,
    projectId: process.env.GCP_PROJECT,
    functionName: process.env.FUNCTION_NAME,
};
// GraphQL Uploads supported only in node v8 or higher
const gqlUploadsEnabled = process.version.substring(0, 2) === 'v8';
// Schema Processing
const typeDefs = graphql_import_1.importSchema('./src/schema.graphql');
const schema = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers: resolvers_1.default });
const schemaWithAuth = graphql_middleware_1.applyMiddleware(schema, auth_1.permissions);
// Apollo Server Configuration
const server = new ApolloServer({
    schema: schemaWithAuth,
    context: ({ req }) => (Object.assign({}, req, { user: auth_1.getUserInfo(req) })),
    uploads: gqlUploadsEnabled,
    introspection: true,
    tracing: true,
    playground: {
        endpoint: `https://${env.region}-${env.projectId}.cloudfunctions.net/${env.functionName}/graphql`,
    },
});
// App and Routes
const app = express();
server.applyMiddleware({ app });
app.get('/nodeversion', function (req, res) {
    res.send(process.version);
});
app.get('/dbtest', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Database Test');
    });
});
exports.api = (req, res) => {
    console.log('Route: ' + req.originalUrl);
    app(req, res);
};
//# sourceMappingURL=index.js.map