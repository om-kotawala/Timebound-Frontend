import React from 'react'
import Calendar from 'react-calendar'

const CalendarPanel = ({ selectedDate, onChange, tileClassName }) => (
  <div className="card">
    <h2 className="text-sm font-display font-bold text-ink-200 uppercase tracking-widest mb-4">
      Select Date
    </h2>
    <Calendar
      onChange={onChange}
      value={selectedDate}
      maxDate={new Date()}
      tileClassName={tileClassName}
    />
    <div className="mt-4 pt-4 border-t border-ink-800/40 flex items-center gap-4 text-xs text-ink-500">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-volt-300" />
        Has tasks
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-volt-300 opacity-60" />
        Today
      </div>
    </div>
  </div>
)

export default CalendarPanel
