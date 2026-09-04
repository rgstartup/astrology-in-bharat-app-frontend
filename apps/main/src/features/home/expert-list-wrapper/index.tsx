import { api } from "@/actions";
import allowedParams from "./expert-list/data/allowed-params";
import { IFetchExpertsResponse } from "./expert-list/api/fetch-expert";
import ExpertList from "./expert-list";
import ExpertGrid from "./expert-list/components/ExpertGrid";
import HomeExpertResults from "./expert-list/components/HomeExpertResults";

export interface ExpertListProps {
  searchParams: Record<string, string | string[] | undefined>;
  title?: string;
}

async function getInitialExpertListProps({
  searchParams,
  title,
}: ExpertListProps) {
  const filteredParams = Object.keys(searchParams)
    .filter((key) => allowedParams.includes(key))
    .reduce(
      (obj, key) => {
        obj[key] = searchParams[key];
        return obj;
      },
      {} as Record<string, any>,
    );

  const queryParams = {
    limit: "20",
    page: "1",
    ...filteredParams,
  };
  const params = new URLSearchParams(queryParams).toString();

  const [response, error] = await api.get<IFetchExpertsResponse>(
    `/expert/account/list?${params}`,
  );

  const listProps = {
    initialExperts: response?.data || [],
    initialPagination: response?.pagination,
    initialError: error?.message,
    title,
  };

  return listProps;
}

export async function ExpertSliderList(props: ExpertListProps) {
  const listProps = await getInitialExpertListProps(props);

  return (
    <ExpertList {...listProps}>
      <HomeExpertResults />
    </ExpertList>
  );
}

export async function ExpertGridList(props: ExpertListProps) {
  const listProps = await getInitialExpertListProps(props);

  return (
    <ExpertList {...listProps}>
      <ExpertGrid />
    </ExpertList>
  );
}
