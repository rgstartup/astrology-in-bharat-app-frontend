import { ExpertSliderList } from "@/features/home/expert-list";

export default async function ExpertsSlot({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams) || {};
  return <ExpertSliderList searchParams={params} />;
}
