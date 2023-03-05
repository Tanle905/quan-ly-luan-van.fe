import { Layout, message, Table, TableProps, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  onFilterTableSubject,
  onSearchTableSubject,
  reloadTableSubject,
} from "../../../constants/observables";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { Student } from "../../../interfaces/student.interface";
import { SearchElement } from "./element/search-element.organism";
import { TableConfig } from "../../../config/interface/table-config.interface";
import { LoadingOutlined } from "@ant-design/icons";
import { FilterElement } from "./element/filter-element.organism";
import { FilterValue, TablePaginationConfig } from "antd/es/table/interface";
import { COMMON_ENDPOINT } from "../../../constants/endpoints";

interface OGTableProps extends TableProps<any> {
  config: TableConfig;
}

export function OGTable({ config, ...props }: OGTableProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [queryParams, setQueryParams] = useState<{}>({});
  const url =
    user && `${process.env.NEXT_PUBLIC_BASE_URL}${config?.apiEndpoint}`;
  const { data, isLoading, isValidating, mutate } = useSWR(
    config.apiEndpoint && url,
    fetchData
  );
  const queryParamsRef = useRef({});

  useEffect(() => {
    const requestSendSubscription = reloadTableSubject.subscribe({
      next: () => {
        mutate();
      },
    });
    const onSearchTableSubscription = onSearchTableSubject.subscribe({
      next: (value) => {
        setQueryParams((prevQueryParams: any) => {
          return { ...prevQueryParams, search: value };
        });
      },
    });
    const onFilterTableSubscription = onFilterTableSubject.subscribe({
      next: (value) => {
        setQueryParams((prevQueryParams: any) => {
          return { ...prevQueryParams, filter: JSON.parse(value as string) };
        });
      },
    });

    return () => {
      requestSendSubscription.unsubscribe();
      onSearchTableSubscription.unsubscribe();
      onFilterTableSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    //Preventing duplicate params
    if (JSON.stringify(queryParamsRef.current) === JSON.stringify(queryParams))
      return;

    queryParamsRef.current = queryParams;
    mutate();
  }, [queryParams]);

  async function fetchData(url: string) {
    const queryParamsList = Object.entries(queryParamsRef.current);
    const mappedQueryParamsList: string[] = [];
    queryParamsList.forEach((entry, index) => {
      if (entry[0] === "filter") {
        const filterEntries = Object.entries(entry[1] as {});
        filterEntries.forEach((filterEntry) =>
          mappedQueryParamsList.push(
            `${index === 0 ? "/?" : "&"}${filterEntry[0]}=${filterEntry[1]}`
          )
        );
      } else if (entry[0] === "sorter") {
        const filterEntries = Object.entries(entry[1] as {});
        filterEntries.forEach((filterEntry) =>
          mappedQueryParamsList.push(
            `${index === 0 ? "/?" : "&"}sortBy=${filterEntry[0]}&isAscSorting=${
              filterEntry[1] === "ascend" ? 1 : -1
            }`
          )
        );
      } else
        mappedQueryParamsList.push(
          `${index === 0 ? "/?" : "&"}${entry[0]}=${entry[1]}`
        );
    });
    const queryString = mappedQueryParamsList.join("");

    try {
      const { data }: { data: { data: any } } = await axios.post(
        `${url}${queryString}`
      );

      return data.data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  function handleSortTable(
    pagi: TablePaginationConfig,
    filter: Record<string, FilterValue | null>,
    sorter: any,
    extra: any
  ) {
    setQueryParams((prevQueryParams: any) => {
      if (sorter.column === undefined) {
        delete prevQueryParams.sorter;
        return prevQueryParams;
      }
      return { ...prevQueryParams, sorter: { [sorter.field]: sorter.order } };
    });

    mutate();
  }

  if (config.apiEndpoint && !data) return null;

  return (
    <>
      <Layout.Content className="px-5 bg-white rounded-md shadow-md">
        <Layout.Content className="flex justify-between space-x-5 px-1 py-5">
          <Layout.Content className="flex items-center space-x-5">
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              className="m-0"
            >
              {config.title}
            </Typography.Title>
            {config.subTitle && (
              <Tag className="rounded-lg">{config.subTitle}</Tag>
            )}
          </Layout.Content>

          <Layout.Content className="flex items-center space-x-2">
            {config.search && <SearchElement />}
            {config.filter && <FilterElement config={config.filter} />}
            {config.extraRightComponent &&
              config.extraRightComponent.map((component, index) =>
                component({ key: index, href: url + COMMON_ENDPOINT.EXPORT })
              )}
          </Layout.Content>
        </Layout.Content>
        <Table
          {...props}
          loading={
            (isLoading || isValidating) && { indicator: <LoadingOutlined /> }
          }
          scroll={{ x: 500 }}
          pagination={{ pageSize: 10 }}
          columns={config.table.columns}
          onChange={handleSortTable}
          dataSource={(config.apiEndpoint ? data : config.data).map(
            (data: any, index: any) => {
              return {
                key: index,
                ...data,
              };
            }
          )}
        />
      </Layout.Content>
    </>
  );
}
