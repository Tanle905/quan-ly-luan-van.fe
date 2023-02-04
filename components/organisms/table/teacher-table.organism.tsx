import { Input, Layout, message, Table, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { teacherListConfig } from "../../../config/student/teacher-list-config";
import { TEACHER_ENDPOINT } from "../../../constants/endpoints";
import { Teacher } from "../../../interfaces/teacher.interface";
import useSWR from "swr";
import {
  onSearchTableSubject,
  requestSendSubject,
} from "../../../constants/observables";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { Student } from "../../../interfaces/student.interface";
import { SearchElement } from "./element/search-element.organism";

interface OGTeacherTableProps {}

export function OGTeacherTable({}: OGTeacherTableProps) {
  const user = useRecoilValue<Student | null>(userState);
  const [msg, contextHolder] = message.useMessage();
  const [queryParams, setQueryParams] = useState<{}>({});
  const { data, mutate } = useSWR<Teacher[] | undefined>(
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
        setQueryParams((prevQueryParams) => {
          return { ...prevQueryParams, search: value };
        });
      },
    });

    return () => {
      requestSendSubscription.unsubscribe();
      onSearchTableSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    queryParamsRef.current = queryParams;
    mutate();
  }, [queryParams]);

  async function fetchData(value: any) {
    const queryParamsList = Object.entries(queryParamsRef.current);
    const queryString =
      queryParamsList.length > 0
        ? queryParamsList.map((entry, index) => {
            if (index === 0) {
              return `/?${entry[0]}=${entry[1]}`;
            }
            return `&${entry[0]}=${entry[1]}`;
          })
        : "";

        try {
      const { data }: { data: { data: Teacher[] } } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${TEACHER_ENDPOINT.BASE}${queryString}`
      );

      return data.data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
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
            <Layout.Content className="flex items-center">
              {teacherListConfig.search && <SearchElement />}
              {teacherListConfig.extraComponent &&
                teacherListConfig.extraComponent.map((component) => component)}
            </Layout.Content>
          </Layout.Content>
          <Table
            bordered
            columns={teacherListConfig.table.columns}
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
