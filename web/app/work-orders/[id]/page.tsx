import WorkOrderDetailClient from './WorkOrderDetailClient';

type Props = { params: { id: string } | Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <WorkOrderDetailClient id={id} />
    </div>
  );
}
