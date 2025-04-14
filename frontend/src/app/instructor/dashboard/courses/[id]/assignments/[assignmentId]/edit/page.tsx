'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
}

export default function EditAssignmentPage() {
  const { id: courseId, assignmentId } = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('File Upload');
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<UploadedFile[]>([]);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      const res = await axios.get(`http://localhost:5001/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      const assignment = res.data.assignment;
      setTitle(assignment.title ?? '');
      setDescription(assignment.description ?? '');
      setDueDate(assignment.due_date?.slice(0, 10) ?? '');
      setIsPublished(assignment.is_published ?? false); // ✅ not `published`
      setComment(assignment.comment ?? '');              // ✅ prepopulate comment
      setExistingFiles(assignment.files ?? []);          // ✅ prepopulate files
    };
  
    fetchAssignment();
  }, [assignmentId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeNewFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeExistingFile = async (fileId: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/assignments/${assignmentId}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setExistingFiles(existingFiles.filter((file) => file.id !== fileId));
      toast.success('File deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('due_date', dueDate);
    formData.append('is_published', isPublished.toString());
    formData.append('comment', comment);
    files.forEach((file) => formData.append('files', file));

    try {
      await axios.put(`http://localhost:5001/api/assignments/${assignmentId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Assignment updated!');
      router.push(`/instructor/dashboard/courses/${courseId}/assignments`);
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  return (
    <div className="bg-white shadow p-6 mt-10">
      <div className="text-2xl font-bold mb-6">Edit Assignment</div>

      <div className="flex border-b mb-4 space-x-6 text-sm font-medium">
        {['File Upload', 'Text Entry', 'Google Doc', 'Box File Picker', 'Google Drive (LTI 1.3)', 'Google Drive'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-2 pb-2 ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'File Upload' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              className="border rounded px-4 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value ?? '')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              className="border rounded px-4 py-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value ?? '')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date:</label>
            <input
              type="date"
              className="border rounded px-4 py-2 w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value ?? '')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload a file, or choose a file you&apos;ve already uploaded.
            </label>

            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-700">File:</span>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block bg-white text-sm text-gray-700 border border-gray-300 rounded px-4 py-1 hover:bg-gray-50"
              >
                Choose File
              </label>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-1">
            {existingFiles.map((file) => (
  <div key={file.id} className="flex justify-between items-center text-sm border px-3 py-1 rounded">
    <a href={`http://localhost:5001${file.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      {file.name}
    </a>
    <button
      type="button"
      onClick={() => removeExistingFile(file.id)}
      className="text-red-600 hover:text-red-800 cursor-pointer"
    >
      Delete
    </button>
  </div>
))}

              {files.map((file, index) => (
                <div key={index} className="flex justify-between items-center text-sm border px-3 py-1 rounded">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="text-red-700 mt-2 cursor-pointer font-medium" onClick={triggerFilePicker}>
              ➕ Add Another File
            </div>
            
          </div>

          <textarea
            placeholder="Comments..."
            className="border rounded px-4 py-2 w-full"
            value={comment}
            onChange={(e) => setComment(e.target.value ?? '')}
          />

          <label className="flex items-center space-x-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="cursor-pointer"
            />
            <span>Publish this assignment</span>
          </label>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/instructor/dashboard/courses/${courseId}/assignments`)}
              className="cursor-pointer px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab !== 'File Upload' && (
        <div className="text-sm text-gray-600 italic">Coming soon: {activeTab} support</div>
      )}
    </div>
  );
}
