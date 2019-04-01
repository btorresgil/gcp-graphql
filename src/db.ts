const Firestore = require('@google-cloud/firestore')
import { filter, propEq, map } from 'ramda'

// Database

export const db = new Firestore()

// Collections

export const companies = db.collection('companies')

// Functions

export const exists = propEq('exists', true)
export const onlyExists = filter(exists)
export const dataWithId = (snapshot: any) => ({
  id: snapshot.id,
  ...snapshot.data(),
})

export const getAllData = async (docRefs: any[]) => {
  const docSnapshots = onlyExists(await db.getAll(docRefs))
  return map(dataWithId, docSnapshots)
}

export const getData = async (docRef: any) => {
  const docSnapshot = await docRef.get()
  return dataWithId(docSnapshot)
}
