// access appwrite database and fetch public exercise library and preset meals read only
import { Query } from 'appwrite'
import {
  DATABASE_ID,
  databases,
  COLLECTIONS,
} from '@/lib/appwrite'

// this function fetches documents from a specified collection in a paginated manner, handling the offset and limit for each request. 
// It returns an array of all documents in the collection.
async function fetchPaginatedLibrary(collectionId) {
  const documents = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
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
// this function fetches all exercise documents from the EXERCISES collection in the Appwrite database.
export async function fetchPublicExerciseLibrary() {
  return await fetchPaginatedLibrary(COLLECTIONS.EXERCISES)
}
// this function fetches all preset meal documents from the PRESET_MEALS collection in the Appwrite database.
export async function fetchPublicPresetMeals() {
  return await fetchPaginatedLibrary(COLLECTIONS.PRESET_MEALS)
}