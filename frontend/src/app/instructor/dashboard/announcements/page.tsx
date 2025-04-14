'use client';
import{useEffect, useState} from 'react';

type Announcement = {
    id: string;
    course_id: string;
    instructor_id: string;
    title: string;
    content: string;
    created_at: string;
}
export default function InstructorAnnouncements(){
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    
    useEffect(() => {
        const fetchAnnouncements = async () =>{
            const res = await fetch('http://localhost:5001/api/announcements/${course_id}', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if(res.ok) setAnnouncements(data.announcements);
        };
        
        fetchAnnouncements();
    }, []);

    return(
        <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">All Announcements</h1>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100 text-sm text-left text-gray-600">
          <tr>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Content</th>
            <th className="py-2 px-4">Date Posted</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr key={announcement.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4 font-medium text-blue-700">{announcement.title}</td>
              <td className = "py-2 px-4">{announcement.content.length > 100
                ? `${announcement.content.slice(0, 100)}...`
                : announcement.content}</td>
              <td className = "py-2 px-4 text-sm text-gray-500">{new Date(announcement.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )

}