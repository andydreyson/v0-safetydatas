/**
 * User-scoped database functions using Prisma
 *
 * SECURITY PRINCIPLE: ALL operations include userId filter
 * This ensures users can ONLY access their own data
 */

import { prisma } from "./prisma"
import type { Document, Group, Prisma } from "@prisma/client"

// ============================================
// DOCUMENT OPERATIONS
// ============================================

/**
 * Get all documents for a specific user
 */
export async function getAllDocuments(userId: string): Promise<Document[]> {
  return await prisma.document.findMany({
    where: { userId },
    include: {
      group: true, // Include group relation
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Get a single document by ID (user-scoped)
 */
export async function getDocumentById(
  userId: string,
  documentId: string
): Promise<Document | null> {
  return await prisma.document.findFirst({
    where: {
      id: documentId,
      userId, // CRITICAL: Verify user owns this document
    },
    include: {
      group: true,
    },
  })
}

/**
 * Create a new document for a user
 */
export async function addDocument(
  userId: string,
  data: Omit<Prisma.DocumentCreateInput, "user">
): Promise<Document> {
  return await prisma.document.create({
    data: {
      ...data,
      user: {
        connect: { id: userId },
      },
    },
  })
}

/**
 * Update a document (user-scoped)
 */
export async function updateDocument(
  userId: string,
  documentId: string,
  updates: Prisma.DocumentUpdateInput
): Promise<Document | null> {
  // First verify user owns this document
  const existing = await getDocumentById(userId, documentId)
  if (!existing) {
    return null // Document doesn't exist or user doesn't own it
  }

  return await prisma.document.update({
    where: { id: documentId },
    data: updates,
  })
}

/**
 * Delete multiple documents (user-scoped)
 */
export async function deleteDocuments(
  userId: string,
  documentIds: string[]
): Promise<number> {
  const result = await prisma.document.deleteMany({
    where: {
      id: { in: documentIds },
      userId, // CRITICAL: Only delete user's own documents
    },
  })

  return result.count
}

/**
 * Delete a single document (user-scoped)
 */
export async function deleteDocument(
  userId: string,
  documentId: string
): Promise<boolean> {
  const result = await prisma.document.deleteMany({
    where: {
      id: documentId,
      userId,
    },
  })

  return result.count > 0
}

/**
 * Assign documents to a group (user-scoped)
 */
export async function assignDocumentsToGroup(
  userId: string,
  documentIds: string[],
  groupId: string
): Promise<number> {
  // Verify user owns the group
  const group = await getGroupById(userId, groupId)
  if (!group) {
    throw new Error("Group not found or access denied")
  }

  const result = await prisma.document.updateMany({
    where: {
      id: { in: documentIds },
      userId, // Only update user's documents
    },
    data: {
      groupId,
    },
  })

  return result.count
}

/**
 * Remove documents from group (user-scoped)
 */
export async function removeDocumentsFromGroup(
  userId: string,
  documentIds: string[]
): Promise<number> {
  const result = await prisma.document.updateMany({
    where: {
      id: { in: documentIds },
      userId,
    },
    data: {
      groupId: null,
    },
  })

  return result.count
}

// ============================================
// GROUP OPERATIONS
// ============================================

/**
 * Get all groups for a specific user
 */
export async function getAllGroups(userId: string): Promise<Group[]> {
  return await prisma.group.findMany({
    where: { userId },
    include: {
      documents: true, // Include documents in group
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Get a single group by ID (user-scoped)
 */
export async function getGroupById(
  userId: string,
  groupId: string
): Promise<Group | null> {
  return await prisma.group.findFirst({
    where: {
      id: groupId,
      userId, // CRITICAL: Verify user owns this group
    },
    include: {
      documents: true,
    },
  })
}

/**
 * Create a new group for a user
 */
export async function addGroup(
  userId: string,
  data: Omit<Prisma.GroupCreateInput, "user">
): Promise<Group> {
  return await prisma.group.create({
    data: {
      ...data,
      user: {
        connect: { id: userId },
      },
    },
  })
}

/**
 * Update a group (user-scoped)
 */
export async function updateGroup(
  userId: string,
  groupId: string,
  updates: Prisma.GroupUpdateInput
): Promise<Group | null> {
  // First verify user owns this group
  const existing = await getGroupById(userId, groupId)
  if (!existing) {
    return null
  }

  return await prisma.group.update({
    where: { id: groupId },
    data: updates,
  })
}

/**
 * Delete a group (user-scoped)
 */
export async function deleteGroup(
  userId: string,
  groupId: string
): Promise<boolean> {
  const result = await prisma.group.deleteMany({
    where: {
      id: groupId,
      userId,
    },
  })

  return result.count > 0
}

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Get user profile with subscription
 */
export async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  })
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Prisma.UserUpdateInput
) {
  return await prisma.user.update({
    where: { id: userId },
    data: updates,
  })
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

/**
 * Get user's subscription
 */
export async function getUserSubscription(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
  })
}

/**
 * Get usage stats for a user
 */
export async function getUserUsageStats(userId: string) {
  const [documentCount, groupCount, subscription] = await Promise.all([
    prisma.document.count({ where: { userId } }),
    prisma.group.count({ where: { userId } }),
    getUserSubscription(userId),
  ])

  return {
    documentsUsed: documentCount,
    documentsLimit: subscription?.documentsLimit ?? 0,
    groupsUsed: groupCount,
    groupsLimit: subscription?.groupsLimit ?? 5,
    subscription,
  }
}

/**
 * Increment document usage counter
 */
export async function incrementDocumentUsage(userId: string, count = 1) {
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    throw new Error("No subscription found")
  }

  return await prisma.subscription.update({
    where: { userId },
    data: {
      documentsUsed: {
        increment: count,
      },
    },
  })
}

/**
 * Decrement document usage counter
 */
export async function decrementDocumentUsage(userId: string, count = 1) {
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    return null
  }

  return await prisma.subscription.update({
    where: { userId },
    data: {
      documentsUsed: {
        decrement: count,
      },
    },
  })
}

/**
 * Increment group usage counter
 */
export async function incrementGroupUsage(userId: string) {
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    throw new Error("No subscription found")
  }

  return await prisma.subscription.update({
    where: { userId },
    data: {
      groupsUsed: {
        increment: 1,
      },
    },
  })
}

/**
 * Decrement group usage counter
 */
export async function decrementGroupUsage(userId: string) {
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    return null
  }

  return await prisma.subscription.update({
    where: { userId },
    data: {
      groupsUsed: {
        decrement: 1,
      },
    },
  })
}
