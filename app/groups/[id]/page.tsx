import { notFound } from 'next/navigation'
import { getGroupById, getDocumentsByGroupId } from '@/lib/db'
import { GroupViewClient } from './group-view-client'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function GroupPage({ params }: PageProps) {
  const { id } = await params

  // Fetch group and its documents
  const group = await getGroupById(id)

  if (!group) {
    notFound()
  }

  const documents = await getDocumentsByGroupId(id)

  return <GroupViewClient group={group} documents={documents} />
}
