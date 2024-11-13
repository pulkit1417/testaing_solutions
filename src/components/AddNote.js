import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import { PenLine, Loader } from 'lucide-react';

const AddNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-8">
          <PenLine className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-semibold text-gray-800">New Note</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full border-0 border-b-2 border-gray-200 px-0 py-2 text-lg font-medium 
                     outline-none focus:border-indigo-600 transition-colors 
                     placeholder:text-gray-400 bg-transparent"
            required
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full h-40 mt-4 p-4 text-gray-700 bg-gray-50/50 rounded-lg 
                     border border-gray-200 outline-none resize-none
                     focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100
                     transition-all placeholder:text-gray-400"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg
                     font-medium hover:bg-indigo-700 active:scale-[0.98]
                     transition-all duration-200 shadow-md
                     hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Adding Note...</span>
              </>
            ) : (
              <>
                <PenLine className="h-5 w-5" />
                <span>Create Note</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;