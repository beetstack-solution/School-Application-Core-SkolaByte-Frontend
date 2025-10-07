import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MiniCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-2 rounded-lg border border-gray-100 bg-gray-200 shadow-md w-[350px]">
      <Calendar
        value={date}
        className="border-none !w-full !text-[10px]"
        tileClassName="hover:bg-blue-50 rounded-sm !p-0 !h-6 !w-6"
        navigationLabel={({ label }) => (
          <span className="!text-xs font-medium text-gray-700">
            {label.split(' ')[0]}
          </span>
        )}
        prevLabel={<span className="!text-[8px] text-gray-500">◀</span>}
        nextLabel={<span className="!text-[8px] text-gray-500">▶</span>}
        formatShortWeekday={(_, date) => 
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
        }
        // tileSize={24}
        minDetail="month"
        showNeighboringMonth={false}
        // calendarType="US"
      />
      <div className="mt-1 text-xs text-center text-gray-500">
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}

export default MiniCalendar;