import React, { useState, useEffect } from "react";

const categories = {
  Work: "bg-indigo-600 text-white",
  Personal: "bg-emerald-500 text-white",
  Others: "bg-amber-500 text-white",
};

const LOCAL_STORAGE_KEY = "calendarEvents";

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  onDelete,
  onEdit,
  events,
}) => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEventName("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setCategory("Work");
    setEditingEventIndex(null);
    setError("");
  };

  const validateForm = () => {
    if (!eventName || !startTime || !endTime) {
      return "Event Name, Start Time, and End Time are required.";
    }
    if (startTime >= endTime) {
      return "Start Time must be earlier than End Time.";
    }
    return "";
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const newEvent = {
      name: eventName,
      startTime,
      endTime,
      description,
      category,
      date: selectedDate,
    };

    if (editingEventIndex !== null) {
      onEdit(editingEventIndex, newEvent);
    } else {
      onSave(newEvent);
    }
    resetForm();
    onClose();
  };

  const handleEdit = (event, index) => {
    setEventName(event.name);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setCategory(event.category);
    setEditingEventIndex(index);
    setError("");
  };

  if (!isOpen) return null;

  const dayEvents = events.filter((event) => event.date === selectedDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl ring-1 ring-gray-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Events for {selectedDate}
          </h3>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        
        <div className="p-4 max-h-64 overflow-y-auto">
          {dayEvents.length > 0 ? (
            <ul className="space-y-3">
              {dayEvents.map((event, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg flex justify-between items-center ${categories[event.category]} hover:opacity-90`}
                >
                  <div className="flex-grow pr-4">
                    <h4 className="font-bold text-sm">{event.name}</h4>
                    <p className="text-xs">
                      {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-xs mt-1">{event.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event, index)}
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No events for this day.
            </p>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {editingEventIndex !== null ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default EventModal;
