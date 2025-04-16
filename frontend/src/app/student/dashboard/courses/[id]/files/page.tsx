'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Folder {
  id: string;
  name: string;
  created_at: string;
  parent_id?: string | null;
}

interface FileItem {
  id: string;
  name: string;
  url: string;
  uploaded_at: string;
  type: string;
  size: number;
  folder_id?: string | null;
}

interface Course {
  name: string;
}

const BASE_URL = 'http://localhost:5001';

export default function StudentFilesPage() {
  const { id: courseId } = useParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  useEffect(() => {
    fetchCourse();
    fetchData();
  }, [courseId]);

  const fetchCourse = async () => {
    const res = await axios.get(`${BASE_URL}/api/courses/${courseId}`, authHeader);
    setCourse(res.data.course);
  };

  const fetchData = async () => {
    const res = await axios.get(`${BASE_URL}/api/files/${courseId}`, authHeader);
    setFolders(res.data.folders || []);
    setFiles(res.data.files || []);
  };

  const handleFolderClick = (folderId: string) => {
    setFolderStack((prev) => [...prev, folderId]);
    setCurrentFolderId(folderId);
  };

  const handleBack = () => {
    const newStack = [...folderStack];
    newStack.pop();
    setCurrentFolderId(newStack[newStack.length - 1] || null);
    setFolderStack(newStack);
  };

  const resetToRoot = () => {
    setCurrentFolderId(null);
    setFolderStack([]);
  };

  const visibleFolders = folders.filter(
    (f) => (f.parent_id ?? null) === currentFolderId && f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleFiles = files.filter(
    (f) => (f.folder_id ?? null) === currentFolderId && f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* 🔷 Breadcrumb Header */}
      <div className="text-xl font-semibold text-blue-700 mb-2">
        <span
          onClick={() => (window.location.href = `/student/dashboard/courses/${courseId}`)}
          className="cursor-pointer hover:underline"
        >
          {course?.name || 'Course'}
        </span>
        <span className="text-gray-400"> › </span>
        <span className="text-red-600">Files</span>
        {folderStack.length > 0 && (
          <>
            <button
              onClick={handleBack}
              className="ml-4 cursor-pointer text-sm text-blue-600 hover:underline"
            >
              ← Back
            </button>
            <button
              onClick={resetToRoot}
              className="ml-2 cursor-pointer text-sm text-gray-500 hover:underline"
            >
              ⇺ Root
            </button>
          </>
        )}
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search files and folders..."
        className="w-full border px-4 py-2 rounded mb-6 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* 📁 Content Table */}
      {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
        <p className="text-gray-500 italic">No folders yet.</p>
      ) : (
        <table className="w-full text-left border-t text-sm">
          <thead>
            <tr className="text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Date Uploaded</th>
              <th className="py-2">Size</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Folders */}
            {visibleFolders.map((folder) => (
              <tr
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-2">📁 {folder.name}</td>
                <td className="py-2">{new Date(folder.created_at).toLocaleString()}</td>
                <td className="py-2">--</td>
                <td className="py-2">--</td>
              </tr>
            ))}

            {/* Files */}
            {visibleFiles.map((file) => (
              <tr key={file.id} className="border-t">
                <td className="py-2">📄 {file.name}</td>
                <td className="py-2">{new Date(file.uploaded_at).toLocaleString()}</td>
                <td className="py-2">{(file.size / 1024).toFixed(1)} KB</td>
                <td className="py-2 space-x-4">
                  <a
                    href={`${BASE_URL}${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                  <a
                    href={`${BASE_URL}${file.url}`}
                    download
                    className="text-green-600 underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
