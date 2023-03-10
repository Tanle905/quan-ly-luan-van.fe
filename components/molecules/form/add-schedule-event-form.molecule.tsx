import { DatePicker, Form, FormInstance, Input } from "antd";
import { DateSelectArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { handleValidateOnFieldChange } from "../../../utils/validation.util";
import { Slot } from "../../../constants/enums";

interface MCAddScheduleEventFormProps {
  currentDateData: (DateSelectArg & DateClickArg) | null;
  currentEventData: any[] | null;
  form: FormInstance;
  isFormEditable: boolean;
}

const slotsData: { name: string; value: Slot }[] = [
  { name: "7h - 8h", value: Slot.Slot1 },
  { name: "8h - 9h", value: Slot.Slot2 },
  { name: "9h - 10h", value: Slot.Slot3 },
  { name: "10h - 11h", value: Slot.Slot4 },
  { name: "11h - 12h", value: Slot.Slot5 },
  { name: "13h - 14h", value: Slot.Slot6 },
  { name: "14h - 15h", value: Slot.Slot7 },
  { name: "15h - 16h", value: Slot.Slot8 },
  { name: "16h - 17h", value: Slot.Slot9 },
  { name: "17h - 18h", value: Slot.Slot10 },
];

export function MCAddScheduleEventForm({
  form,
  currentDateData,
  currentEventData,
  isFormEditable,
}: MCAddScheduleEventFormProps) {
  const [selectedSlots, setSelectedSlots] = useState<
    { name: string; value: Slot }[]
  >([]);
  const selectedDateRange = dayjs(currentDateData?.date);

  useEffect(() => {
    form.setFieldsValue({ date: selectedDateRange });
    if (currentEventData) {
      const filteredSlot = slotsData.filter((slot) =>
        currentEventData[0].slots.find((curSlot: any) => {
          return curSlot.slot === slot.value;
        })
      );
      setSelectedSlots(filteredSlot);
    }
  }, []);

  function handleSelectSlot(curSlot: { name: string; value: Slot }) {
    let newSelectedSlots = [...selectedSlots];
    if (selectedSlots.find((slot) => slot.value === curSlot.value)) {
      newSelectedSlots = newSelectedSlots.filter(
        (slot) => slot.value !== curSlot.value
      );
    } else newSelectedSlots.push(curSlot);
    setSelectedSlots(newSelectedSlots);
    form.setFieldValue("slot", newSelectedSlots);
  }

  return (
    <Form form={form} layout="vertical">
      <span>Ch???n bu???i b???n</span>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {slotsData.map((curSlot, index) => (
          <SlotElement
            key={index}
            slot={curSlot}
            onclick={() => handleSelectSlot(curSlot)}
            selected={
              selectedSlots.find((slot) => slot.value === curSlot.value)
                ? true
                : false
            }
          />
        ))}
      </div>
      <Form.Item label={"Th???i gian"} name="date" required className="mt-2">
        <DatePicker
          format={"DD-MM-YYYY"}
          className="w-full"
          disabled={!isFormEditable}
        />
      </Form.Item>
    </Form>
  );
}

function SlotElement(props: {
  slot: { name: string; value: Slot };
  onclick?: (value: Slot) => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={() => props.onclick && props.onclick(props.slot.value)}
      className={`px-3 py-2 text-center rounded-md shadow-md cursor-pointer transition-all ${
        props.selected ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
      }`}
    >
      {props.slot.name}
    </div>
  );
}
