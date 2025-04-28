'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface AssignmentFile {
  id: string;
  name: string;
  url: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  is_published: boolean;
  comment: string;
  marks: number;
  files: AssignmentFile[];
}

interface Props {
  courseId: string;
  search: string;
  filterOption: string;
}

export default function ViewAssignments({ courseId, search, filterOption }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/by-course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAssignments(res.data.assignments);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  if (loading) return <p className="text-gray-600">Loading assignments...</p>;

  const filteredAssignments = assignments
    .filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((a) => {
      if (filterOption === 'published') return a.is_published === true;
      if (filterOption === 'unpublished') return a.is_published === false;
      return true;
    })
    .sort((a, b) => {
      if (filterOption === 'due-newest') return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      if (filterOption === 'due-oldest') return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      return 0;
    });

  return (
    <div className="space-y-4">
      {filteredAssignments.length === 0 ? (
        <p className="text-gray-500 italic">No assignments found.</p>
      ) : (
        filteredAssignments.map((a) => (
          <div
            key={a.id}
            className="flex justify-between border border-gray-300 rounded p-4 hover:bg-gray-50"
          >
            {/* Left: Assignment Info */}
            <div>
              <h2 className="font-bold text-lg text-gray-800">{a.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{a.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold">Due:</span>{' '}
                {new Date(a.due_date).toDateString()}
              </p>
              {a.comment && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold">Comments:</span> {a.comment}
                </p>
              )}
              {typeof a.marks === 'number' && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold">Marks:</span> {a.marks}
                </p>
              )}
              {a.files?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {a.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm cursor-pointer block"
                    >
                      📎 {file.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Status + Actions */}
            <div className="flex flex-col items-end gap-2">
              {a.is_published && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Published
                </span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/instructor/dashboard/courses/${courseId}/assignments/${a.id}/edit`)
                  }
                  className="text-blue-600 cursor-pointer"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={async () => {
                    const confirmed = confirm('Delete this assignment?');
                    if (!confirmed) return;
                    try {
                      await axios.delete(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${a.id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                        }
                      );
                      toast.success('Assignment deleted');
                      fetchAssignments();
                    } catch {
                      toast.error('Delete failed');
                    }
                  }}
                  className="text-red-600 cursor-pointer"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
