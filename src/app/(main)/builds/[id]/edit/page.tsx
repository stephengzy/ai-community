import { BuildEditClient } from "./build-edit-client"

export default async function BuildEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BuildEditClient buildId={id} />
}
