import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import { ArrowLeft, Edit3, Trash2, AlertCircle } from 'lucide-react';

const ViewNote = () => {
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, 'notes', id));

        if (!noteDoc.exists()) {
          setError('Note not found');
          return;
        }

        const noteData = noteDoc.data();

        if (!auth.currentUser || noteData.userId !== auth.currentUser.uid) {
          setError('You do not have permission to view this note');
          return;
        }

        setNote({ id: noteDoc.id, ...noteData });
      } catch (error) {
        console.error('Error fetching note:', error);
        setError('Error fetching note');
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-red-100">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Notes List
          </Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </Link>
          <div className="flex gap-3">
            <Link
              to={`/edit/${note.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
              Edit Note
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {note.title}
            </h1>
            <div className="prose max-w-none">
              <div
                className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
              >
                {note.content}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Delete Note</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-full hover:from-red-700 hover:to-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNote;