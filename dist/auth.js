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
const graphql_shield_1 = require("graphql-shield");
const jwt = require("jsonwebtoken");
// Auth
function getUserInfo(req) {
    let token;
    try {
        token = jwt.verify(req.get('Authorization'), 'mysecret');
    }
    catch (e) {
        return null;
    }
    return { sub: token.sub, name: token.name, claims: token.claims };
}
exports.getUserInfo = getUserInfo;
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
// Schema Permissions
exports.permissions = graphql_shield_1.shield({
    Query: {
        hello: graphql_shield_1.not(isAuthenticated),
        companies: graphql_shield_1.and(isAuthenticated, graphql_shield_1.or(isAdmin, isEditor)),
        company: graphql_shield_1.and(isAuthenticated, isAdmin),
    },
});
//# sourceMappingURL=auth.js.map