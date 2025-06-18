import { useState } from "react";
import "./GolfCalendar.css";

export default function GolfCalendar({ outings, onOutingClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  function getCalendarData() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay();

    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isOtherMonth: true,
      });
    }

    const currentMonthDays = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayOutings = outings.filter((outing) => {
        const outingDate = new Date(outing.date);
        return outingDate.toDateString() === date.toDateString();
      });

      currentMonthDays.push({
        date: day,
        fullDate: date,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        outings: dayOutings,
      });
    }

    const totalCells = 42;
    const remainingCells =
      totalCells - prevMonthDays.length - currentMonthDays.length;
    const nextMonthDays = [];
    for (let day = 1; day <= remainingCells; day++) {
      nextMonthDays.push({
        date: day,
        isCurrentMonth: false,
        isOtherMonth: true,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }

  function navigateMonth(direction) {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const calendarDays = getCalendarData();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="golf-calendar">
      <div className="calendar-header">
        <div className="month-navigation">
          <button
            className="nav-btn"
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>

          <h3 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>

          <button
            className="nav-btn"
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <button className="today-btn" onClick={goToToday}>
          Today
        </button>
      </div>

      <div className="calendar-grid">
        <div className="day-headers">
          {dayNames.map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-body">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${
                day.isCurrentMonth ? "current-month" : "other-month"
              } ${day.isToday ? "today" : ""} ${
                day.outings && day.outings.length > 0 ? "has-outings" : ""
              }`}
            >
              <span className="day-number">{day.date}</span>

              {day.outings && day.outings.length > 0 && (
                <div className="day-outings">
                  {day.outings.slice(0, 3).map((outing, outingIndex) => (
                    <div
                      key={outing._id || outingIndex}
                      className={`outing-dot ${outing.userRsvpd ? "rsvped" : "not-rsvped"}`}
                      onClick={() => onOutingClick && onOutingClick(outing)}
                      title={`${outing.courseName} at ${outing.time}${outing.userRsvpd ? " (You're going!)" : ""}`}
                    >
                      <span className="dot-text">
                        {outing.courseName.substring(0, 10)}
                        {outing.courseName.length > 10 ? "..." : ""}
                      </span>
                    </div>
                  ))}

                  {day.outings.length > 3 && (
                    <div className="more-outings">
                      +{day.outings.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot rsvped"></div>
          <span>You're going</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot not-rsvped"></div>
          <span>RSVP needed</span>
        </div>
      </div>
    </div>
  );
}
