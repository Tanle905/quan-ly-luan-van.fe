import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import * as XLSX from "xlsx";
import { slotsData } from "../components/molecules/form/add-schedule-event-form.molecule";
import { ScheduleEventType } from "../constants/enums";
import { CalendarEvent } from "../interfaces/calendar.interface";

export function exportExcels(data: any) {
  const thesisDefenseWeek: CalendarEvent = data.find((e: any) =>
    isThesisDefenseWeek(e)
  );
  const dateArr = createDateArr(thesisDefenseWeek);
  const processedData = cloneDeep(data).reduce((prev: any, cur: any) => {
    if (cur.type !== ScheduleEventType.ThesisDefenseEvent) return prev;
    const newProps = {
      ["Thư kí"]: cur.teacherName[2],
      ["Phản biện"]: cur.teacherName[1],
      ["Hội đồng"]: cur.teacherName[0],
    };
    delete cur.id;

    return [
      ...prev,
      {
        ...cur,
        slots: cur.slots[0].slot,
        ...newProps,
      },
    ];
  }, []);
  console.log(processedData);
  const sheetData = slotsData.map((slot, index) => {
    const curSlotEventList = dateArr.map((date) => {
      const formattedDate = date.format("DD-MM-YYYY");
      const curSlotEvents = processedData.filter(
        (d: any) =>
          dayjs(d.start).format("DD-MM-YYYY") === formattedDate &&
          d.slots === slot.value
      );

      return [
        formattedDate,
        curSlotEvents
          .map((curSlotEvent: any) =>
            curSlotEvent
              ? `_Đề tài: ${curSlotEvent?.topic.topicName} - Sinh viên: ${
                  curSlotEvent?.studentName
                } - Giảng viên: ${curSlotEvent?.teacherName?.join(", ")} `
              : ""
          )
          .join("\n"),
      ];
    });

    return {
      ["Buổi/Ngày"]: slot.name,
      ...Object.fromEntries(curSlotEventList),
    };
  });

  function isThesisDefenseWeek(e: any) {
    return e.backgroundColor === "#358630";
  }

  function createDateArr(thesisDefenseWeek: any) {
    const dateArr = [];
    const startDate = dayjs(thesisDefenseWeek.start);
    const endDate = dayjs(thesisDefenseWeek.end);
    let curDate = startDate.clone();
    while (endDate.diff(curDate, "day") >= 1) {
      dateArr.push(curDate);
      curDate = curDate.add(1, "day");
    }

    return dateArr;
  }

  const worksheet = XLSX.utils.json_to_sheet(sheetData, {
    cellStyles: true,
  });
  worksheet["!cols"] = [
    { wch: 50 },
    { wch: 50 },
    { wch: 50 },
    { wch: 50 },
    { wch: 50 },
    { wch: 50 },
    { wch: 50 },
    { wch: 50 },
  ];
  worksheet["!rows"] = [
    { hpx: 25 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
    { hpx: 100 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "DataSheet.xlsx");
}
