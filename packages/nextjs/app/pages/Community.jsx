import React, { useState } from "react";

const communities = [
  {
    id: 1,
    name: "CyberRealm Players",
    members: "5.2k",
    description: "Join the official CyberRealm community",
    color: "bg-blue-600",
  },
  {
    id: 2,
    name: "NFT Traders",
    members: "12.8k",
    description: "Connect with other NFT collectors and traders",
    color: "bg-purple-600",
  },
  {
    id: 3,
    name: "Game King Guild",
    members: "8.4k",
    description: "Strategy discussions and tournaments",
    color: "bg-green-600",
  },
  {
    id: 4,
    name: "Mystic Quest",
    members: "6.7k",
    description: "Quest guides and rare item trading",
    color: "bg-pink-600",
  },
];

const Community = () => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  const handleJoinCommunity = (communityId) => {
    if (joinedCommunities.includes(communityId)) {
      setJoinedCommunities(
        joinedCommunities.filter((id) => id !== communityId),
      );
    } else {
      setJoinedCommunities([...joinedCommunities, communityId]);
    }
  };

  return (
    <div className="min-h-screen bg-[#232323] text-white">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <h1 className="text-3xl font-bold mb-8">Communities</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
          {communities.map((community) => (
            <div
              key={community.id}
              className={`rounded-2xl p-6 border border-gray-800 shadow-lg flex flex-col justify-between ${community.color} bg-opacity-80`}
            >
              <div>
                <h2 className="text-white text-xl font-bold mb-2">
                  {community.name}
                </h2>
                <p className="text-gray-200 mb-4">{community.description}</p>
                <p className="text-gray-300 text-sm mb-2">
                  Members: {community.members}
                </p>
              </div>
              <button
                onClick={() => handleJoinCommunity(community.id)}
                className={`mt-4 px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${joinedCommunities.includes(community.id) ? "bg-[#3b2ff7] text-white" : "bg-white text-[#3b2ff7]"}`}
              >
                {joinedCommunities.includes(community.id)
                  ? "Leave Community"
                  : "Join Community"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
