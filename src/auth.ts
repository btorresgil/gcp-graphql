import { rule, shield, and, or, not } from 'graphql-shield'
import * as jwt from 'jsonwebtoken'

// Auth

export function getUserInfo(req: any) {
  let token
  try {
    token = jwt.verify(req.get('Authorization'), 'mysecret')
  } catch (e) {
    return null
  }
  return { sub: token.sub, name: token.name, claims: token.claims }
}

// Rules

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.user.claims !== null
})

const isAdmin = rule()(async (parent, args, ctx, info) => {
  return ctx.user.claims === 'admin'
})

const isEditor = rule()(async (parent, args, ctx, info) => {
  return ctx.user.claims === 'editor'
})

// Schema Permissions

export const permissions = shield({
  Query: {
    hello: not(isAuthenticated),
    companies: and(isAuthenticated, or(isAdmin, isEditor)),
    company: and(isAuthenticated, isAdmin),
  },
})
