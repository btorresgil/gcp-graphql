const Firestore = require('@google-cloud/firestore')
import { filter, propEq, map } from 'ramda'

// Database

export const db = new Firestore()

// Collections

export const companies = db.collection('companies')

// Functions

export const existing = filter(propEq('exists', true))

export const getAllData = async (docRefs: any[]) => {
  const docSnapshots = existing(await db.getAll(docRefs))
  const docs = map((d: any) => ({ id: d.id, ...d.data() }))(docSnapshots)
  return docs
}

export const getData = async (docRef: any) => {
  const docSnapshot = await docRef.get()
  const doc = { id: docSnapshot.id, ...docSnapshot.data() }
  return doc
}
