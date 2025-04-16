'use client';

import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: string;
  title: string;
  due_date: string;
  course_title: string;
  course_id: string;
}

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  course_id: string;
}

const localizer = momentLocalizer(moment);

export default function InstructorAssignmentCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const router = useRouter();

  useEffect(() => {
    const token=localStorage.getItem('token')

    axios
      .get('http://localhost:5001/api/assignments/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mapped: Event[] = res.data.assignments.map((a: Assignment) => ({
          title: `${a.course_title}: ${a.title}`,
          start: new Date(a.due_date),
          end: new Date(a.due_date),
          allDay: true,
          course_id: a.course_id, // ✅ include course_id
        }));
        setEvents(mapped);
      })
      .catch((err) => console.error('❌ Failed to load assignments:', err));
  }, []);

  const handleSelectEvent = (event: Event) => {
    // Navigate to course assignments page
    router.push(`/instructor/dashboard/courses/${event.course_id}/assignments`);
  };

  return (
    <div className="flex justify-center items-center w-full px-4 py-10">
      <div className="w-full max-w-[1000px] h-[700px] bg-white shadow-md rounded-md p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleSelectEvent} // ✅ handle click
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
