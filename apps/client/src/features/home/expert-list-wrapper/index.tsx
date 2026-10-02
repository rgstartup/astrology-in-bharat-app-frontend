import { API_ROUTES, apiV2 } from "@/actions";
import allowedParams from "./expert-list/data/allowed-params";
import { IFetchExpertsResponse } from "./expert-list/api/fetch-expert";
import ExpertList from "./expert-list";
import ExpertGrid from "./expert-list/components/ExpertGrid";
import HomeExpertResults from "./expert-list/components/HomeExpertResults";
import { IExpert, PaginationMeta } from "@repo/lib";

export interface ExpertListProps {
  searchParams: Record<string, string | string[] | undefined>;
  title?: string;
}

interface InititialExpertListProps {
  initialExperts: IExpert[];
  initialPagination?: PaginationMeta;
  initialError?: string;
  title?: string;
}

async function getInitialExpertListProps({ searchParams, title }: ExpertListProps) {
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

  const result = await apiV2.get<IFetchExpertsResponse>(`${API_ROUTES.EXPERTS.LIST}?${params}`);

  const listProps: InititialExpertListProps = {
    initialExperts: [] as IExpert[],
    initialPagination: undefined,
    initialError: undefined,
    title,
  };

  if (!result.ok) {
    listProps.initialError = result.error?.message;
    return listProps;
  }

  listProps.initialExperts = result.data.data;
  listProps.initialPagination = result.data.meta;
  listProps.initialError = undefined;
  listProps.title = title;

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
