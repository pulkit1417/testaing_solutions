import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import { PenSquare, Trash2, ChevronRight, Search, Plus } from 'lucide-react';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, 'notes'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotes = () => {
    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
    setFilteredNotes(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes(notes.filter(note => note.id !== id));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-blue-500">
              Notes
            </h1>
          </div>
          <Link 
            to="/add-note"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-medium shadow-lg shadow-blue-600/20 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            New Note
          </Link>
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 bg-white backdrop-blur-sm rounded-2xl border border-gray-200 focus:ring-2 shadow-xl"
          />
        </div>
        {!isLoading && filteredNotes.length === 0 && (
          <div className="text-center py-20">
            {!searchQuery && (
              <Link 
                to="/add-note" 
                className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center gap-2 bg-purple-50 px-6 py-3 rounded-full transition-colors"
              >
                <Plus className="h-5 w-5" />
                Start your first note
              </Link>
            )}
          </div>
        )}  
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note, index) => (
            <div 
              key={note.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200 hover:shadow-2xl hover:shadow-purple-200 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {note.title}
                  </h2>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      to={`/edit/${note.id}`}
                      className="p-2 rounded-xl hover:bg-purple-50 transition-colors"
                    >
                      <PenSquare className="h-5 w-5 text-gray-400 hover:text-purple-500" />
                    </Link>
                    <button
                      onClick={() => {
                        setNoteToDelete(note.id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-3 min-h-[4.5rem]">
                  {note.content}
                </p>
                <Link 
                  to={`/notes/${note.id}`}
                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
                >
                  Read More
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Delete Note</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(noteToDelete)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
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

export default NotesList;