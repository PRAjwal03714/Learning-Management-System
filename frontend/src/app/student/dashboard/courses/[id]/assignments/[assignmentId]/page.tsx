'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  marks?: number;
  files: AssignmentFile[];
}

interface Submission {
  id: string;
  file_url: string;
  attempt_number: number;
  created_at: string;
}

export default function AssignmentSubmissionPage() {
  const { id: courseId, assignmentId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchAssignment();
    fetchSubmissions();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignment(res.data.assignment);
    } catch (err) {
      toast.error('Failed to fetch assignment details');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/assignments/${assignmentId}/submission`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.submissions) {
        setSubmissions(res.data.submissions);
        setSelectedAttempt(res.data.submissions.length > 0 ? res.data.submissions[res.data.submissions.length - 1].attempt_number : 1);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      files.forEach(file => formData.append('files', file)); // 🔥 Correct multiple file append

      await axios.post(`http://localhost:5001/api/assignments/${assignmentId}/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Files submitted successfully!');
      setFiles([]);
      setIsSubmitting(false);
      await fetchSubmissions();
    } catch (err) {
      console.error('Error submitting files:', err);
      toast.error('Submission failed.');
    }
  };

  const handleNewAttempt = () => {
    setSelectedAttempt(selectedAttempt + 1);
    setFiles([]);
    setIsSubmitting(true);
  };

  const handleCancel = () => {
    setFiles([]);
    setIsSubmitting(false);
  };

  const currentAttemptFiles = submissions.filter(s => s.attempt_number === selectedAttempt);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{assignment?.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Due: {assignment?.due_date ? new Date(assignment.due_date).toLocaleString() : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-800">{assignment?.marks} Points Possible</p>
        </div>
      </div>

      {/* Attempt Selector */}
      <div className="flex items-center gap-4">
        <select
          value={selectedAttempt}
          onChange={(e) => setSelectedAttempt(parseInt(e.target.value))}
          className="border px-4 py-2 rounded cursor-pointer"
        >
          {Array.from(new Set(submissions.map(s => s.attempt_number))).sort((a, b) => a - b).map(attempt => (
            <option key={attempt} value={attempt}>
              Attempt {attempt}
            </option>
          ))}
        </select>
        <span className="text-green-600 font-semibold">In Progress</span>
      </div>

      {/* Assignment Details */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Details</h2>
        <p className="text-gray-700">{assignment?.description}</p>

        {assignment?.files?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Attached Files:</h3>
            <ul className="list-disc list-inside text-blue-600">
              {assignment.files.map(file => (
                <li key={file.id}>
                  <a
                    href={`http://localhost:5001${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline cursor-pointer"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Upload Section */}
      {isSubmitting ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
            />
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <span key={idx} className="text-sm text-gray-700 truncate max-w-[150px]">
                  {file.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer"
            >
              Submit
            </button>

            <button
              onClick={handleCancel}
              className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleNewAttempt}
          className="border border-gray-500 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 cursor-pointer"
        >
          New Attempt
        </button>
      )}

      {/* Submitted Files */}
      {currentAttemptFiles.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Submitted Files:</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2 border">File</th>
                <th className="text-left px-4 py-2 border">Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {currentAttemptFiles.map((file, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">
                    {file.file_url ? (
                      <a
                        href={`http://localhost:5001${file.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline cursor-pointer"
                      >
                        {file.file_url.split('/').pop()}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No File</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {file.created_at ? new Date(file.created_at).toLocaleString() : 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
