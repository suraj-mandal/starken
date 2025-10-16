
import React from 'react';

const Profile = () => (
  <div className="min-h-screen bg-[#232323] text-white flex flex-col items-center justify-center p-2 sm:p-0">
    <div className="bg-[#232323] rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-lg w-full max-w-md mt-8 sm:mt-12 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-[#3b2ff7] rounded-full flex items-center justify-center text-white text-3xl font-bold">U</div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">User</p>
          <p className="text-gray-400 text-sm">user@email.com</p>
          <p className="text-gray-400 text-sm mt-2">Wallet: <span className="font-mono">0xgnje.....gafn</span></p>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
