import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get complete user data with all relationships
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        documents: {
          select: {
            id: true,
            name: true,
            fileName: true,
            fileSize: true,
            fileType: true,
            uploadedAt: true,
            tags: true,
            groupId: true,
          }
        },
        groups: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            _count: {
              select: {
                documents: true
              }
            }
          }
        },
        accounts: {
          select: {
            provider: true,
            type: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            documents: true,
            groups: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Format export data (GDPR compliant)
    const exportData = {
      exportDate: new Date().toISOString(),
      exportType: 'GDPR Data Export',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        phone: user.phone,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      subscription: user.subscription ? {
        planName: user.subscription.planName,
        status: user.subscription.status,
        stripeCustomerId: user.subscription.stripeCustomerId,
        stripeSubscriptionId: user.subscription.stripeSubscriptionId,
        stripePriceId: user.subscription.stripePriceId,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        canceledAt: user.subscription.canceledAt,
        trialStart: user.subscription.trialStart,
        trialEnd: user.subscription.trialEnd,
        documentsLimit: user.subscription.documentsLimit,
        groupsLimit: user.subscription.groupsLimit,
        usersLimit: user.subscription.usersLimit,
        createdAt: user.subscription.createdAt,
        updatedAt: user.subscription.updatedAt,
      } : null,
      documents: user.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        fileType: doc.fileType,
        uploadedAt: doc.uploadedAt,
        tags: doc.tags,
        groupId: doc.groupId,
      })),
      groups: user.groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        color: group.color,
        createdAt: group.createdAt,
        documentCount: group._count.documents,
      })),
      accounts: user.accounts.map(account => ({
        provider: account.provider,
        type: account.type,
        createdAt: account.createdAt,
      })),
      statistics: {
        totalDocuments: user._count.documents,
        totalGroups: user._count.groups,
        totalAccounts: user.accounts.length,
      }
    }

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="safetydatas-export-${user.id}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })

  } catch (error: any) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to export data' },
      { status: 500 }
    )
  }
}
