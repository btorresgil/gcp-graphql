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
const graphql_import_1 = require("graphql-import");
const graphql_middleware_1 = require("graphql-middleware");
const graphql_tools_1 = require("graphql-tools");
const graphql_shield_1 = require("graphql-shield");
const resolvers_1 = require("./resolvers");
const typeDefs = graphql_import_1.importSchema('./src/schema.graphql');
const schema = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers: resolvers_1.default });
// Rules
const isAuthenticated = graphql_shield_1.rule()((parent, args, ctx, info) => __awaiter(this, void 0, void 0, function* () {
    return ctx.user.claims !== null;
}));
const isAdmin = graphql_shield_1.rule()((parent, args, ctx, info) => __awaiter(this, void 0, void 0, function* () {
    return ctx.user.claims === 'admin';
}));
const isEditor = graphql_shield_1.rule()((parent, args, ctx, info) => __awaiter(this, void 0, void 0, function* () {
    return ctx.user.claims === 'editor';
}));
// Permissions
const permissions = graphql_shield_1.shield({
    Query: {
        hello: graphql_shield_1.not(isAuthenticated),
        companies: graphql_shield_1.and(isAuthenticated, graphql_shield_1.or(isAdmin, isEditor)),
        company: graphql_shield_1.and(isAuthenticated, isAdmin),
    },
});
const schemaWithMiddleware = graphql_middleware_1.applyMiddleware(schema, permissions);
exports.default = schemaWithMiddleware;
//# sourceMappingURL=schema.js.map