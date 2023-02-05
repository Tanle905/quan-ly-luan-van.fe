import { UnorderedListOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, MenuProps, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FilterConfig } from "../../../../config/interface/table-config.interface";
import { onFilterTableSubject } from "../../../../constants/observables";

interface FilterElementProps {
  config: FilterConfig[];
}

export function FilterElement({ config }: FilterElementProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const [filterValue, setFilterValue] = useState<{} | null>(null);

  useEffect(() => {
    config.map(async (filter, index) => {
      const data = filter.endpoint
        ? await filterFetcher(filter.endpoint)
        : filter.data;

      handleSetItems({
        key: index + 1,
        label: (
          <Layout.Content className="flex flex-col w-52">
            <span className="block">{filter.label}</span>
            <Select
              {...filter.selectProps}
              onChange={(value) =>
                setFilterValue((prevFilter) => {
                  if (!prevFilter) return { [filter.key]: value };
                  return { ...prevFilter, [filter.key]: value };
                })
              }
              options={data.map((item: any) => {
                return { value: item.value };
              })}
            ></Select>
          </Layout.Content>
        ),
      });
    });
  }, []);

  function handleSetItems(item: any) {
    setItems((prevItems) => [...(prevItems as []), item]);
  }

  async function filterFetcher(endpoint: string) {
    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + endpoint
    );

    return data.data;
  }

  return (
    <Dropdown
      menu={{
        items: [
          ...(items as []),
          {
            key: 0,
            label: (
              <Button
                disabled={!filterValue}
                type="primary"
                onClick={() =>
                  onFilterTableSubject.next(JSON.stringify(filterValue))
                }
              >
                Lọc
              </Button>
            ),
          },
        ],
      }}
      open={open}
      onOpenChange={() => setOpen(!open)}
      trigger={["click"]}
    >
      <Button>
        <UnorderedListOutlined />
      </Button>
    </Dropdown>
  );
}
