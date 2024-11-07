import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru, enUS } from "date-fns/locale";
import "./Calendar.css";
registerLocale("ru", ru);
registerLocale("en", enUS);

const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [language, setLanguage] = useState("ru");

  const handleLanguageChange = (e: any) => {
    setLanguage(e.target.value);
  };

  console.log(startDate.toLocaleDateString());

  return (
    <div>
      <select onChange={handleLanguageChange} value={language}>
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="kg">Кыргызча</option>
      </select>

      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date as Date)}
        locale={language === "kg" ? "ru" : language}
        dateFormat={"dd.MM.yyyy"}
        calendarStartDay={1}
        className={"datePicker"}
        calendarClassName={"calendarPicker"}
        minDate={new Date()}
      />
    </div>
  );
};

export default Calendar;
