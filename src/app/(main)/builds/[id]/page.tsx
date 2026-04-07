import { BuildDetailClient } from "./build-detail-client"

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BuildDetailClient buildId={id} />
}
