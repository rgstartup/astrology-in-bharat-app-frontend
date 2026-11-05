import { API_ROUTES, apiV2 } from "@/actions";
import allowedParams from "./data/allowed-params";
import { IFetchExpertsResponse } from "./api/fetch-expert";
import ExpertList, { ExpertListDataProps } from "./expert-list.component";
import { IExpert, PaginationMeta } from "@repo/lib";

export interface ExpertListProps {
  searchParams: Record<string, string | string[] | undefined>;
  title?: string;
}

async function getInitialExpertListProps({ searchParams, title }: ExpertListProps): Promise<ExpertListDataProps> {
  const filteredParams = Object.keys(searchParams)
    .filter((key) => allowedParams.includes(key))
    .reduce(
      (obj, key) => {
        obj[key] = searchParams[key];
        return obj;
      },
      {} as Record<string, string | string[] | undefined>,
    );

  const queryParams = {
    limit: "20",
    page: "1",
    ...filteredParams,
  };
  const params = new URLSearchParams(
    Object.entries(queryParams).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  ).toString();

  const result = await apiV2.get<IFetchExpertsResponse>(`${API_ROUTES.EXPERTS.LIST}?${params}`);

  const listProps: ExpertListDataProps = {
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
  listProps.title = title;

  return listProps;
}

export async function ExpertSliderList(props: ExpertListProps) {
  const listProps = await getInitialExpertListProps(props);

  return <ExpertList {...listProps} />;
}
