import { useEffect, useState } from "react";
import "./App.css";
// import Calendar from "./Calendar/Calendar";
// import FanatMap from "./FanatMap/FanatMap";
// import TimePicker from "rc-time-picker";
// import TimeRangePicker from "react-time-range-picker";
// import "react-time-range-picker/dist/styles.css";
import { message, TimePicker } from "antd";
import { parse } from "date-fns";
import dayjs, { Dayjs } from "dayjs";

function App() {
  const [timeRange, setTimeRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    const fetchStartTime = async () => {
      const responseStartTime = "09:00"; // замените на реальный ответ с бэка
      const startTime = dayjs(parse(responseStartTime, "HH:mm", new Date())); // Конвертируем в Dayjs
      setTimeRange([startTime, null]);
    };
    fetchStartTime();
  }, []);

  const handleTimeChange = (times: [Dayjs | null, Dayjs | null] | null) => {
    if (times && times[0] && times[1]) {
      const start = times[0];
      const end = times[1];

      const minInterval = 30; // Интервал в минутах
      const interval = end.diff(start, "minute");

      if (interval < minInterval) {
        message.warning("Минимальный интервал — 30 минут.");
        setTimeRange([start, null]); // Сбрасываем endTime, если интервал меньше 30 минут
      } else {
        setTimeRange([start, end]); // Устанавливаем оба времени, если интервал корректный
      }
    } else {
      setTimeRange(times || [null, null]);
    }
  };

  useEffect(() => {
    if (timeRange[0] && timeRange[1]) {
      const startTimeFormatted = timeRange[0].format("HH:mm");
      const endTimeFormatted = timeRange[1].format("HH:mm");

      // Отправляем данные на сервер
      console.log("Selected Time Range:", {
        start: startTimeFormatted,
        end: endTimeFormatted,
      });
    }
  }, [timeRange]);

  const disabledEndTime = (selectedStartTime: Dayjs | null) => {
    if (!selectedStartTime) return {};
    const minEndTime = selectedStartTime.add(30, "minute");

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(
          (hour) => hour < minEndTime.hour()
        ),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === minEndTime.hour()) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute < minEndTime.minute()
          );
        }
        return [];
      },
    };
  };

  return (
    <div className="App">
      {/* <FanatMap /> */}
      {/* <Calendar /> */}
      <TimePicker.RangePicker
        format={"HH:mm"}
        value={timeRange}
        onChange={handleTimeChange}
        disabledTime={(_, type) =>
          type === "end" ? disabledEndTime(timeRange[0]) : {}
        }
      />
      <div>
        <p>Start Time: {timeRange[0]?.format("HH:mm") || "Not selected"}</p>
        <p>End Time: {timeRange[1]?.format("HH:mm") || "Not selected"}</p>
      </div>
    </div>
  );
}

export default App;
