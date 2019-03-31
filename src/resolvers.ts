import { db, getAllData, getData, companies } from './db'

const resolvers = {
  Query: {
    hello: (_: any, { name }: { name: any }) => `Hello ${name || 'World'}`,
    companies: async () => {
      return await getAllData(await companies.listDocuments())
    },
    company: async (_: any, { id }: { id: string }) => {
      return await getData(companies.doc(id))
    },
  },
}

export default resolvers
