'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

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

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function FilesPage() {
  const { id: courseId } = useParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const [folderName, setFolderName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    try {
      const res = await axios.get(`${BASE_URL}/api/courses/${courseId}`, authHeader);
      setCourse(res.data.course);
    } catch {
      toast.error('Failed to load course info');
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/files/${courseId}`, authHeader);
      setFolders(res.data.folders || []);
      setFiles(res.data.files || []);
    } catch {
      toast.error('Failed to load files');
    }
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await axios.post(
        `${BASE_URL}/api/files/folder/create`,
        {
          course_id: courseId,
          name: folderName,
          parent_id: currentFolderId || null,
        },
        authHeader
      );
      setFolderName('');
      toast.success('Folder created');
      await fetchData();
    } catch {
      toast.error('Failed to create folder');
    }
  };

  const uploadFile = async () => {
    if (!file) return toast.error('No file selected');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', courseId);
    if (currentFolderId) formData.append('folder_id', currentFolderId);

    try {
      await axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
          ...authHeader.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File uploaded');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchData();
    } catch {
      toast.error('Upload failed');
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/files/${fileId}`, authHeader);
      toast.success('File deleted');
      await fetchData();
    } catch {
      toast.error('Failed to delete file');
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/files/folder/${folderId}`, authHeader);
      toast.success('Folder deleted');
      await fetchData();
    } catch {
      toast.error('Failed to delete folder');
    }
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

  
  const visibleFolders = folders.filter((f) => (f.parent_id ?? null) === currentFolderId && f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const visibleFiles = files.filter((f) => (f.folder_id ?? null) === currentFolderId && f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 -mt-6">
      {/* Breadcrumb */}
      {course && (
  <div className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-4">
    <span
      onClick={() => window.location.href = `/instructor/dashboard/courses/${courseId}`}
      className="cursor-pointer hover:underline"
    >
      {course.name}
    </span>
    <span className="text-gray-400">›</span>
    <span className="text-red-600">Files</span>
    {folderStack.length > 0 && (
      <>
        <button onClick={handleBack} className="text-sm text-blue-600 hover:underline">← Back</button>
        <button onClick={resetToRoot} className="text-sm text-gray-500 hover:underline">⇺ Root</button>
      </>
    )}
  </div>
)}


      {/* Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search files and folders..."
        className="w-full border px-3 py-2 rounded mb-6 text-sm"
      />

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2 border px-4 py-2 rounded cursor-pointer bg-white shadow-sm text-sm">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} ref={fileInputRef} className="hidden" />
          📁 Choose File
        </label>
        {file && <span className="text-gray-800 text-sm font-medium">{file.name}</span>}
        <button onClick={uploadFile} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Upload</button>
        <input
          type="text"
          placeholder="New folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
        <button onClick={createFolder} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">+ Folder</button>
      </div>

      {/* Folder/File List */}
      {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
        <p className="text-gray-500 italic">No folders yet.</p>
      ) : (
        <table className="w-full text-left border-t text-sm">
          <thead>
            <tr className="text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Date Created</th>
              <th className="py-2">Size</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleFolders.map((folder) => (
              <tr key={folder.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleFolderClick(folder.id)}>
                <td className="py-2">📁 {folder.name}</td>
                <td className="py-2">{new Date(folder.created_at).toLocaleString()}</td>
                <td className="py-2">--</td>
                <td className="py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {visibleFiles.map((file) => (
              <tr key={file.id} className="border-t">
                <td className="py-2">📄 {file.name}</td>
                <td className="py-2">{new Date(file.uploaded_at).toLocaleString()}</td>
                <td className="py-2">{(file.size / 1024).toFixed(1)} KB</td>
                <td className="py-2 flex gap-2">
                  <a href={`${BASE_URL}${file.url}`} target="_blank" className="text-blue-600 hover:underline">View</a>
                  <a href={`${BASE_URL}${file.url}`} download className="text-green-600 hover:underline">Download</a>
                  <button onClick={() => deleteFile(file.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

