import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'

export type DocumentData = {
  id: string
  name: string
  originalName: string
  compoundName: string
  uploadDate: string
  fileType: string
  size: string
  filePath: string // Path to the actual file on disk
  tags: string[]
  category?: string
  description?: string
  pageNumber?: number
}

export type Group = {
  id: string
  name: string
  description?: string
  createdDate: string
  documentIds: string[] // Documents can be in multiple groups
}

type DatabaseSchema = {
  documents: DocumentData[]
  groups: Group[]
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const dbFile = path.join(dataDir, 'db.json')
const adapter = new JSONFile<DatabaseSchema>(dbFile)
const defaultData: DatabaseSchema = { documents: [], groups: [] }

let db: Low<DatabaseSchema> | null = null

export async function getDatabase(): Promise<Low<DatabaseSchema>> {
  if (!db) {
    db = new Low<DatabaseSchema>(adapter, defaultData)
    await db.read()
  }
  return db
}

// Helper functions
export async function getAllDocuments(): Promise<DocumentData[]> {
  const database = await getDatabase()
  await database.read()
  return database.data.documents
}

export async function getDocumentById(id: string): Promise<DocumentData | undefined> {
  const database = await getDatabase()
  await database.read()
  return database.data.documents.find(doc => doc.id === id)
}

export async function addDocument(doc: DocumentData): Promise<DocumentData> {
  const database = await getDatabase()
  await database.read()
  database.data.documents.push(doc)
  await database.write()
  return doc
}

export async function updateDocument(id: string, updates: Partial<DocumentData>): Promise<DocumentData | null> {
  const database = await getDatabase()
  await database.read()
  const index = database.data.documents.findIndex(doc => doc.id === id)
  if (index === -1) return null

  database.data.documents[index] = {
    ...database.data.documents[index],
    ...updates
  }
  await database.write()
  return database.data.documents[index]
}

export async function deleteDocument(id: string): Promise<boolean> {
  const database = await getDatabase()
  await database.read()
  const index = database.data.documents.findIndex(doc => doc.id === id)
  if (index === -1) return false

  // Delete the actual file
  const doc = database.data.documents[index]
  const filePath = path.join(process.cwd(), doc.filePath)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  database.data.documents.splice(index, 1)
  await database.write()
  return true
}

export async function deleteDocuments(ids: string[]): Promise<number> {
  const database = await getDatabase()
  await database.read()

  let deletedCount = 0
  for (const id of ids) {
    const index = database.data.documents.findIndex(doc => doc.id === id)
    if (index !== -1) {
      // Delete the actual file
      const doc = database.data.documents[index]
      const filePath = path.join(process.cwd(), doc.filePath)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      database.data.documents.splice(index, 1)
      deletedCount++
    }
  }

  await database.write()
  return deletedCount
}

// Group Helper Functions

export async function getAllGroups(): Promise<Group[]> {
  const database = await getDatabase()
  await database.read()

  // Ensure groups array exists (for migration compatibility)
  if (!database.data.groups) {
    database.data.groups = []
    await database.write()
  }

  return database.data.groups
}

export async function getGroupById(id: string): Promise<Group | undefined> {
  const database = await getDatabase()
  await database.read()
  return database.data.groups?.find(group => group.id === id)
}

export async function addGroup(group: Group): Promise<Group> {
  const database = await getDatabase()
  await database.read()

  // Ensure groups array exists (for migration compatibility)
  if (!database.data.groups) {
    database.data.groups = []
  }

  database.data.groups.push(group)
  await database.write()
  return group
}

export async function updateGroup(id: string, updates: Partial<Group>): Promise<Group | null> {
  const database = await getDatabase()
  await database.read()

  if (!database.data.groups) {
    return null
  }

  const index = database.data.groups.findIndex(group => group.id === id)
  if (index === -1) return null

  database.data.groups[index] = {
    ...database.data.groups[index],
    ...updates
  }
  await database.write()
  return database.data.groups[index]
}

export async function deleteGroup(id: string): Promise<boolean> {
  const database = await getDatabase()
  await database.read()

  if (!database.data.groups) {
    return false
  }

  const index = database.data.groups.findIndex(group => group.id === id)
  if (index === -1) return false

  database.data.groups.splice(index, 1)
  await database.write()
  return true
}

export async function deleteGroups(ids: string[]): Promise<number> {
  const database = await getDatabase()
  await database.read()

  if (!database.data.groups) {
    return 0
  }

  let deletedCount = 0
  for (const id of ids) {
    const index = database.data.groups.findIndex(group => group.id === id)
    if (index !== -1) {
      database.data.groups.splice(index, 1)
      deletedCount++
    }
  }

  await database.write()
  return deletedCount
}

export async function getDocumentsByGroupId(groupId: string): Promise<DocumentData[]> {
  const database = await getDatabase()
  await database.read()

  const group = database.data.groups?.find(g => g.id === groupId)
  if (!group) return []

  return database.data.documents.filter(doc => group.documentIds.includes(doc.id))
}

export async function addDocumentsToGroup(groupId: string, docIds: string[]): Promise<boolean> {
  const database = await getDatabase()
  await database.read()

  if (!database.data.groups) {
    return false
  }

  const group = database.data.groups.find(g => g.id === groupId)
  if (!group) return false

  // Add only new document IDs (avoid duplicates)
  for (const docId of docIds) {
    if (!group.documentIds.includes(docId)) {
      group.documentIds.push(docId)
    }
  }

  await database.write()
  return true
}

export async function removeDocumentsFromGroup(groupId: string, docIds: string[]): Promise<boolean> {
  const database = await getDatabase()
  await database.read()

  if (!database.data.groups) {
    return false
  }

  const group = database.data.groups.find(g => g.id === groupId)
  if (!group) return false

  group.documentIds = group.documentIds.filter(id => !docIds.includes(id))

  await database.write()
  return true
}
