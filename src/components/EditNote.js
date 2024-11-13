import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { FaEdit } from 'react-icons/fa';

const EditNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const noteDoc = await getDoc(doc(db, 'notes', id));
      if (noteDoc.exists()) {
        const noteData = noteDoc.data();
        setTitle(noteData.title);
        setContent(noteData.content);
      }
    } catch (error) {
      setError('Failed to load note');
      console.error('Error fetching note:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'notes', id), {
        title,
        content,
        updatedAt: new Date().toISOString()
      });
      navigate('/');
    } catch (error) {
      setError('Failed to update note');
      console.error('Error updating note:', error);
    } finally {
      setUpdating(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Note</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="Enter note title"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="content" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-vertical"
              placeholder="Enter your note content"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className={`
                flex items-center px-6 py-3 rounded-lg text-white font-medium
                ${updating 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                }
                transition-colors duration-200
              `}
            >
              <FaEdit className="mr-2" />
              {updating ? 'Updating...' : 'Update Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote;