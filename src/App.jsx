
import React, { useState } from 'react';
import { AuthView, Marketplace, Profile, Chat, Community } from './pages';
// Placeholder logo, replace with your own later
const PlaceholderLogo = () => (
  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">S</div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('market');
  const [menuOpen, setMenuOpen] = useState(false);

  // Simple navigation and auth logic for demo
  if (!isAuthenticated) {
    return <AuthView onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('market')}>
            <PlaceholderLogo />
            <h1 className="text-xl font-bold">Starken</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Hamburger for mobile */}
            <button className="sm:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <span className="text-2xl">&#10005;</span> // X icon
              ) : (
                <span className="text-2xl">&#9776;</span> // Hamburger icon
              )}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium text-sm hidden sm:block"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Desktop nav */}
        <nav className="max-w-7xl mx-auto px-4 py-2 gap-4 justify-center bg-gray-900 border-t border-gray-800 hidden sm:flex">
          <button onClick={() => setCurrentPage('market')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Marketplace</button>
          <button onClick={() => setCurrentPage('profile')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Profile</button>
          <button onClick={() => setCurrentPage('chat')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Chat</button>
          <button onClick={() => setCurrentPage('community')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === 'community' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Community</button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium text-sm"
          >
            Logout
          </button>
        </nav>
        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav className="sm:hidden bg-[#232323] border-t border-gray-800 px-4 py-4 flex flex-col gap-2 z-50">
            <button onClick={() => { setCurrentPage('market'); setMenuOpen(false); }} className={`w-full px-4 py-3 rounded-lg font-medium text-base transition-colors ${currentPage === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Marketplace</button>
            <button onClick={() => { setCurrentPage('profile'); setMenuOpen(false); }} className={`w-full px-4 py-3 rounded-lg font-medium text-base transition-colors ${currentPage === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Profile</button>
            <button onClick={() => { setCurrentPage('chat'); setMenuOpen(false); }} className={`w-full px-4 py-3 rounded-lg font-medium text-base transition-colors ${currentPage === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Chat</button>
            <button onClick={() => { setCurrentPage('community'); setMenuOpen(false); }} className={`w-full px-4 py-3 rounded-lg font-medium text-base transition-colors ${currentPage === 'community' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Community</button>
            <button
              onClick={() => { setIsAuthenticated(false); setMenuOpen(false); }}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-medium text-base mt-2"
            >
              Logout
            </button>
          </nav>
        )}
      </header>
      <main>
        {currentPage === 'market' && <Marketplace />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'chat' && <Chat />}
        {currentPage === 'community' && <Community />}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Starken NFT Marketplace
      </footer>
    </div>
  );
}

export default App;
