import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday } from "date-fns";
import EventModal from "./EventModal";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false); // For viewing all events
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDates, setFilteredDates] = useState([]);
  const [matchingEvents, setMatchingEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        if (parsedEvents && typeof parsedEvents === "object") {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error("Failed to parse events from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (searchQuery) {
      const matchingDates = [];
      const matchingEventsList = [];

      Object.entries(events).forEach(([date, eventsList]) => {
        const filteredEvents = eventsList.filter((event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredEvents.length > 0) {
          matchingDates.push(date);
          filteredEvents.forEach((event) =>
            matchingEventsList.push({ ...event, date })
          );
        }
      });

      setFilteredDates(matchingDates);
      setMatchingEvents(matchingEventsList);
    } else {
      setFilteredDates([]);
      setMatchingEvents([]);
    }
  }, [searchQuery, events]);

  const handleDayClick = (day) => {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      const existingEvents = updatedEvents[selectedDate] || [];
      const isOverlap = existingEvents.some(
        (existingEvent) =>
          (event.startTime < existingEvent.endTime &&
            event.startTime >= existingEvent.startTime) ||
          (event.endTime > existingEvent.startTime &&
            event.endTime <= existingEvent.endTime) ||
          (event.startTime <= existingEvent.startTime &&
            event.endTime >= existingEvent.endTime)
      );

      if (isOverlap) {
        alert("Error: This event overlaps with an existing event.");
        return prevEvents;
      }

      if (!updatedEvents[selectedDate]) updatedEvents[selectedDate] = [];
      updatedEvents[selectedDate].push(event);

      return updatedEvents;
    });
  };

  const handleDeleteEvent = (index) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[selectedDate].splice(index, 1);
      if (updatedEvents[selectedDate].length === 0) {
        delete updatedEvents[selectedDate];
      }
      return updatedEvents;
    });
  };

  const exportAllAsJSON = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "all-events.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllAsCSV = () => {
    const rows = [["Date", "Event Name", "Start Time", "End Time", "Description"]];
    Object.entries(events).forEach(([date, eventsList]) => {
      eventsList.forEach((event) => {
        rows.push([
          date,
          event.name,
          event.startTime,
          event.endTime,
          event.description || "",
        ]);
      });
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "all-events.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const days = [];
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const calendarStart = startOfWeek(startOfCurrentMonth);
  const calendarEnd = endOfWeek(endOfCurrentMonth);

  eachDayOfInterval({ start: calendarStart, end: calendarEnd }).forEach((date) => {
    days.push(date);
  });

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
          }
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button
          onClick={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
          }
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const formattedDay = format(day, "yyyy-MM-dd");
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isTodayDate = isToday(day);
          return (
            <div
              key={formattedDay}
              className={`p-2 border rounded cursor-pointer ${isCurrentMonth ? "" : "bg-gray-200"
                } ${isTodayDate ? "border-green-500 font-bold bg-green-300" : ""}`}
              onClick={() => isCurrentMonth && handleDayClick(day)}
            >
              <div>{format(day, "d")}</div>
              {events[formattedDay] && (
                <div className="mt-1 text-sm text-blue-600">
                  {events[formattedDay].length} events
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setIsAllEventsModalOpen(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          View All Events
        </button>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        events={events[selectedDate] || []}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Modal for all events */}
      {isAllEventsModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">All Events</h2>
            <div>
              {Object.entries(events).map(([date, eventList]) => (
                <div key={date}>
                  <h3 className="font-bold">{date}</h3>
                  {eventList.map((event, index) => (
                    <div key={index} className="border-b py-2">
                      <div>{event.name}</div>
                      <div>{event.startTime} - {event.endTime}</div>
                      <div>{event.description}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={exportAllAsJSON}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Export All as JSON
              </button>
              <button
                onClick={exportAllAsCSV}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Export All as CSV
              </button>
              <button
                onClick={() => setIsAllEventsModalOpen(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
