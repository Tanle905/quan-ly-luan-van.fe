import React from "react";
import { Layout, Result } from "antd";
import Head from "next/head";
import { OGHeader } from "../components/organisms/header/header.organism";
const { Content } = Layout;

function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Quản lý luận văn</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content className="min-h-screen bg-gray-100">
        <OGHeader />
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
        />
      </Content>
    </>
  );
}

export default NotFoundPage;
