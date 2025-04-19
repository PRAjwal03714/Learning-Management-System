'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  marks: number;
  files?: { id: string; name: string; url: string }[];
}

interface SubmittedFile {
  file_name: string;
  original_name: string;
  uploaded_at: string;
}

interface Submission {
  attempt_number: number;
  files: SubmittedFile[];
}

export default function AssignmentSubmissionPage() {
  const { id: courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(true); // Important: first time true
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssignmentDetails();
    fetchSubmissions();
  }, []);

  const fetchAssignmentDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignment(res.data.assignment);
    } catch (err) {
      toast.error('Failed to fetch assignment');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/assignments/${assignmentId}/submission`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.submissions || [];
      setSubmissions(data);
      if (data.length > 0) {
        setSelectedAttempt(data[data.length - 1].attempt_number);
        setShowUploadSection(false);
      } else {
        setSelectedAttempt(1);
        setShowUploadSection(true); // if no submission yet
      }
    } catch (err) {
      toast.error('Failed to fetch submissions');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return toast.error('Please select files');

    setIsSubmitting(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Assignment submitted!');
      setShowUploadSection(false);
      setFiles([]);
      await fetchSubmissions();
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewAttempt = () => {
    setShowUploadSection(true);
    setFiles([]);
    const nextAttempt = Math.max(...submissions.map(s => s.attempt_number), 0) + 1;
    setSelectedAttempt(nextAttempt);
  };

  const handleCancel = () => {
    if (submissions.length > 0) {
      const latest = submissions[submissions.length - 1].attempt_number;
      setSelectedAttempt(latest);
    } else {
      setSelectedAttempt(1);
    }
    setShowUploadSection(false);
    setFiles([]);
  };

  const handleChooseFilesClick = () => {
    fileInputRef.current?.click();
  };

  const currentAttemptFiles = submissions.find(s => s.attempt_number === selectedAttempt)?.files || [];

  return (
    <div className="mt-1 space-y-8">
      {/* Assignment Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{assignment?.title}</h1>
          <p className="text-gray-500 text-sm">Due: {assignment?.due_date ? new Date(assignment.due_date).toLocaleString() : ''}</p>
        </div>
        <p className="font-bold text-gray-700">{assignment?.marks} Points Possible</p>
      </div>

      {/* Attempt Dropdown */}
      <div className="flex items-center gap-4">
        <select
          value={selectedAttempt}
          onChange={(e) => setSelectedAttempt(Number(e.target.value))}
          className="border rounded px-4 py-2 cursor-pointer"
        >
          {Array.from(new Set([
            ...submissions.map(s => s.attempt_number),
            ...(showUploadSection ? [selectedAttempt] : [])
          ])).sort((a, b) => a - b).map((num) => (
            <option key={num} value={num}>Attempt {num}</option>
          ))}
        </select>
        {submissions.length > 0 ? (
          <span className="text-green-600 font-semibold">In Progress</span>
        ) : (
          <span className="text-blue-600 font-semibold">Submit Your Assignment</span>
        )}
      </div>

      {/* Assignment Details */}
      <div>
        <h2 className="text-lg font-semibold">Details</h2>
        <p className="text-gray-700">{assignment?.description}</p>
      </div>

      {/* Instructor Files */}
      {assignment?.files?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4">Files Provided:</h2>
          {assignment.files.map((f) => (
            <a
              key={f.id}
              href={`http://localhost:5001${f.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mt-1"
            >
              📁 {f.name}
            </a>
          ))}
        </div>
      )}

      {/* Upload / Submission Section */}
      {showUploadSection ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleChooseFilesClick}
            className="bg-blue-100 cursor-pointer text-blue-700 px-6 py-2 rounded-md font-semibold hover:bg-blue-200"
          >
            Choose Files
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

          {files.map((file, i) => (
            <div key={i} className="flex justify-between items-center text-sm border px-3 py-1 rounded">
              <span>{file.name}</span>
              <FaTimes onClick={() => handleRemoveFile(i)} className="text-red-500 cursor-pointer" />
            </div>
          ))}

          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
            {submissions.length > 0 && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Show submitted files after submission */}
          {currentAttemptFiles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mt-6 mb-2">Submitted Files:</h2>
              <div className="border rounded">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2">File</th>
                      <th className="text-left px-4 py-2">Uploaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAttemptFiles.map((f, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">
                          <a
                            href={`http://localhost:5001/uploads/student-submissions/${f.file_name}`}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            {f.original_name}
                          </a>
                        </td>
                        <td className="px-4 py-2">
                          {new Date(f.uploaded_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* New Attempt Button */}
          <button
            onClick={handleNewAttempt}
            className="bg-blue-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-600 mt-6"
          >
            New Attempt
          </button>
        </>
      )}
    </div>
  );
}
