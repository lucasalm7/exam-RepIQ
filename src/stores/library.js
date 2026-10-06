// access appwrite database and fetch public exercise library and preset meals read only
import { Query } from 'appwrite'
import {
  DATABASE_ID,
  databases,
  COLLECTIONS,
} from '@/lib/appwrite'

export async function fetchPublicExerciseLibrary() {
  const documents = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EXERCISES,
      [
        Query.orderAsc('name'),
        Query.limit(limit),
        Query.offset(offset),
      ],
    )

    documents.push(...response.documents)

    if (
      documents.length >= response.total ||
      response.documents.length === 0
    ) {
      break
    }

    offset += response.documents.length
  }

  return documents
}

export async function fetchPublicPresetMeals() {
  const documents = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PRESET_MEALS,
      [
        Query.orderAsc('name'),
        Query.limit(limit),
        Query.offset(offset),
      ],
    )

    documents.push(...response.documents)

    if (
      documents.length >= response.total ||
      response.documents.length === 0
    ) {
      break
    }

    offset += response.documents.length
  }

  return documents
}