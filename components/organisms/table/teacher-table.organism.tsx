import { Layout, message, Table, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { teacherListConfig } from "../../../config/student/teacher-list-config";
import { TEACHER_ENDPOINT } from "../../../constants/endpoints";
import { Teacher } from "../../../interfaces/teacher.interface";
import useSWR from "swr";
import {
  onFilterTableSubject,
  onSearchTableSubject,
  requestSendSubject,
} from "../../../constants/observables";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { Student } from "../../../interfaces/student.interface";
import { SearchElement } from "./element/search-element.organism";
import { LoadingOutlined } from "@ant-design/icons";
import { FilterElement } from "./element/filter-element.organism";
import { FilterValue, TablePaginationConfig } from "antd/es/table/interface";

interface OGTeacherTableProps {}

export function OGTeacherTable({}: OGTeacherTableProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [msg, contextHolder] = message.useMessage();
  const [queryParams, setQueryParams] = useState<any>({});
  const { data, isLoading, isValidating, mutate } = useSWR<
    Teacher[] | undefined
  >(
    user && process.env.NEXT_PUBLIC_BASE_URL + TEACHER_ENDPOINT.BASE,
    fetchData
  );
  const queryParamsRef = useRef({});

  useEffect(() => {
    const requestSendSubscription = requestSendSubject.subscribe({
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

  async function fetchData(value: any) {
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
      const { data }: { data: { data: Teacher[] } } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${TEACHER_ENDPOINT.BASE}${queryString}`
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
    console.log(sorter);
    mutate();
  }

  if (!data) return null;

  return (
    <>
      {contextHolder}
      <Layout.Content className="mx-20 px-5 bg-white rounded-md shadow-md">
        <Layout.Content className="mt-20">
          <Layout.Content className="flex justify-between space-x-5 px-1 py-5">
            <Layout.Content className="flex items-center space-x-5">
              <Typography.Title
                level={5}
                style={{ marginBottom: 0 }}
                className="m-0"
              >
                {teacherListConfig.title}
              </Typography.Title>
              {teacherListConfig.subTitle && (
                <Tag className="rounded-lg">{teacherListConfig.subTitle}</Tag>
              )}
            </Layout.Content>
            <Layout.Content className="flex items-center space-x-2">
              {teacherListConfig.search && <SearchElement />}
              {teacherListConfig.filter && (
                <FilterElement config={teacherListConfig.filter} />
              )}
              {teacherListConfig.extraComponent &&
                teacherListConfig.extraComponent.map((component) => component)}
            </Layout.Content>
          </Layout.Content>
          <Table
            loading={
              (isLoading || isValidating) && { indicator: <LoadingOutlined /> }
            }
            pagination={{ pageSize: 10 }}
            bordered
            columns={teacherListConfig.table.columns}
            onChange={handleSortTable}
            dataSource={data.map((data, index) => {
              return {
                key: index,
                ...data,
              };
            })}
          />
        </Layout.Content>
      </Layout.Content>
    </>
  );
}
