import React, { useState } from "react";
import { getException } from "./getException";

interface IException {
  event_date: string;
  description: string;
  work_day: null | number;
}

function DateForm() {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [data, setData] = useState<number>(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (startDate && endDate && Date.parse(startDate) <= Date.parse(endDate)) {
      const curDate = new Date(new Date(startDate).getTime());
      let count = 0;
      while (curDate <= new Date(endDate)) {
        if (curDate.getDay() !== 0 && curDate.getDay() !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
      }

      const fetchData = getException();
      if (fetchData) {
        fetchData.then((dates) => {
          dates.forEach((item: IException) => {
            if (
              Date.parse(item.event_date) < Date.parse(endDate) &&
              Date.parse(startDate) < Date.parse(item.event_date)
            ) {
              if (item.work_day === null) {
                count--;
              } else {
                count++;
              }
            }
          });
          setData(count);
        });
      } else {
        setData(count);
      }
    } else {
      setData(0);
    }
  };

  return (
    <form className="max-w-[1200px] px-8 py-4 m-auto">
      <div className="grid grid-cols-5 px-8 py-12 border border-gray-900/25 rounded-lg items-end ">
        <div className="col-span-2 w-full pr-2">
          <label
            htmlFor="first-name"
            className="block text-xl font-medium text-gray-900 justify-self-center"
          >
            Дата начала
          </label>
          <div className="mt-3">
            <input
              type="date"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              className="flex justify-center w-full h-[40px] rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-2 -outline-offset-2 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:-outline-offset-2 focus:outline-indigo-600 text-l"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-2 w-full px-2">
          <label
            htmlFor="first-name"
            className="block text-xl font-medium text-gray-900 justify-self-center"
          >
            Дата окончания
          </label>
          <div className="mt-3">
            <input
              type="date"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              className="flex justify-center w-full h-[40px] rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-2 -outline-offset-2 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:-outline-offset-2 focus:outline-indigo-600 text-l"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="col-span-1 flex w-full h-[40px] items-center justify-center rounded-md bg-indigo-600 text-xl/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleClick}
        >
          Расчитать
        </button>
        <div className="grid col-span-full w-full mt-20 mb-10">
          <span className="block text-8xl font-medium text-indigo-600 justify-self-center">
            {data}
          </span>
          <span className="block text-6xl font-medium text-gray-900 justify-self-center mt-8">
            Рабочих дней
          </span>
        </div>
      </div>
    </form>
  );
}

export default DateForm;
