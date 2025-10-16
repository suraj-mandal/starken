import React, { useState } from "react";

const featuredItems = [
  {
    id: 1,
    title: "Ethereal Blade of .....",
    game: "CyberRealm",
    image: "chess",
    price: "8.5",
    usdPrice: "$6500",
    owner: "Charles",
    fullTitle: "Ethereal Blade of Storm",
    fullGame: "Game King",
    description:
      "A legendary blade forged in the digital storms of CyberRealm. This weapon channels the power of lightning and can devastate enemies with its electrical attacks.",
    power: 200,
    priceChange: "+20%",
    currentPrice: "1.5",
  },
  {
    id: 2,
    title: "Guardian's Crystal..",
    game: "MysticQuest",
    image: "guardian",
    price: "8.5",
    usdPrice: "$6500",
    owner: "Alex",
    fullTitle: "Guardian's Crystal",
    description: "A mystical crystal that protects its bearer from dark magic.",
    power: 180,
    priceChange: "+15%",
    currentPrice: "1.5",
  },
  {
    id: 3,
    title: "Prismatic Core ....",
    game: "ElementalWars",
    image: "prismatic",
    price: "8.5",
    usdPrice: "$6500",
    owner: "Jordan",
    fullTitle: "Prismatic Core",
    description: "Harness the power of all elements with this rare core.",
    power: 220,
    priceChange: "+25%",
    currentPrice: "1.5",
  },
  {
    id: 4,
    title: "Storm Caller's Sta....",
    game: "Game King",
    image: "storm",
    price: "8.5",
    usdPrice: "$6500",
    owner: "Morgan",
    fullTitle: "Storm Caller's Staff",
    description: "Command the weather and unleash devastating storms.",
    power: 195,
    priceChange: "+18%",
    currentPrice: "1.5",
  },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    game: "",
    image: "",
    price: "",
    usdPrice: "",
    owner: "You",
    fullTitle: "",
    description: "",
    power: "",
    priceChange: "",
    currentPrice: "",
  });

  const handleRegisterItem = (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert("Connect your wallet first!");
      return;
    }
    if (
      !newItem.title ||
      !newItem.game ||
      !newItem.price ||
      !newItem.currentPrice
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    featuredItems.push({
      ...newItem,
      id: featuredItems.length + 1,
    });
    setShowRegisterForm(false);
    setNewItem({
      title: "",
      game: "",
      image: "",
      price: "",
      usdPrice: "",
      owner: "You",
      fullTitle: "",
      description: "",
      power: "",
      priceChange: "",
      currentPrice: "",
    });
    alert("Item registered!");
  };

  const filteredItems = featuredItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.game.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConnectWallet = () => {
    setWalletConnected(true);
    setTimeout(() => {
      alert("Wallet Connected: 0xgnje.....gafn");
    }, 300);
  };

  const handleBuyNow = (item) => {
    alert(`Purchasing ${item.fullTitle} for ${item.currentPrice} ETH`);
  };

  const handleMakeOffer = (item) => {
    const offer = prompt(`Enter your offer for ${item.fullTitle} (in ETH):`);
    if (offer) {
      alert(`Offer of ${offer} ETH submitted for ${item.fullTitle}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <div className="flex gap-3">
            {walletConnected ? (
              <>
                <span className="text-sm text-gray-300">0xgnje.....gafn</span>
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium text-sm"
                >
                  Register Item
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        {/* Register Item Modal */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <form
              onSubmit={handleRegisterItem}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800 w-full max-w-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Register Game Item
              </h2>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Game *
                </label>
                <input
                  type="text"
                  value={newItem.game}
                  onChange={(e) =>
                    setNewItem({ ...newItem, game: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Image Type
                </label>
                <select
                  value={newItem.image}
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select</option>
                  <option value="chess">Chess</option>
                  <option value="guardian">Guardian</option>
                  <option value="prismatic">Prismatic</option>
                  <option value="storm">Storm</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  ETH Price *
                </label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  USD Price
                </label>
                <input
                  type="text"
                  value={newItem.usdPrice}
                  onChange={(e) =>
                    setNewItem({ ...newItem, usdPrice: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Full Title
                </label>
                <input
                  type="text"
                  value={newItem.fullTitle}
                  onChange={(e) =>
                    setNewItem({ ...newItem, fullTitle: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Description
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Power
                </label>
                <input
                  type="number"
                  value={newItem.power}
                  onChange={(e) =>
                    setNewItem({ ...newItem, power: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Price Change
                </label>
                <input
                  type="text"
                  value={newItem.priceChange}
                  onChange={(e) =>
                    setNewItem({ ...newItem, priceChange: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Current Price *
                </label>
                <input
                  type="number"
                  value={newItem.currentPrice}
                  onChange={(e) =>
                    setNewItem({ ...newItem, currentPrice: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600"
            placeholder="Search items or games..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#232323] rounded-2xl overflow-hidden border border-gray-800 shadow-lg hover:border-[#3b2ff7] transition-all"
            >
              <div
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer"
              >
                <div className="h-40 w-full bg-black flex items-center justify-center overflow-hidden border-b border-gray-700">
                  {/* Replace with actual image later */}
                  {item.image === "chess" ? (
                    <img
                      src="/assets/react.svg"
                      alt="Chess"
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="text-5xl text-white">?</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {item.fullTitle || item.title}
                  </h3>
                  <p className="text-white font-semibold mb-2">
                    {item.fullGame || item.game}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-xs">Owned by</span>
                    <span className="text-white font-bold">{item.owner}</span>
                  </div>
                  <div className="bg-[#2d2d3a] rounded-xl p-4 mb-3 border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-xl font-bold">
                        {item.currentPrice || item.price}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">ETH</span>
                      <span className="text-gray-400 text-xs ml-auto">
                        ~ {item.usdPrice}
                      </span>
                    </div>
                    <span className="text-green-400 text-xs block">
                      {item.priceChange} from last week
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNow(item);
                      }}
                      className="flex-1 bg-[#3b2ff7] hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMakeOffer(item);
                      }}
                      className="flex-1 border border-[#3b2ff7] hover:bg-[#232323] text-[#3b2ff7] py-2 rounded-lg font-semibold text-sm"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Item Detail Modal - Figma inspired design */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-0">
            <div className="bg-[#232323] rounded-2xl w-full max-w-md m-0 sm:m-4 border border-gray-800 shadow-xl">
              <div className="relative">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 left-4 z-10 text-white hover:text-gray-300 bg-gray-800 rounded-lg p-2"
                >
                  &lt;
                </button>
                <div className="h-44 bg-black flex items-center justify-center rounded-t-2xl overflow-hidden border border-gray-700">
                  {/* Replace with actual image later */}
                  {selectedItem.image === "chess" ? (
                    <img
                      src="/assets/react.svg"
                      alt="Chess"
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="text-7xl text-white">?</div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-white text-lg font-bold mb-1">
                    {selectedItem.fullTitle}
                  </h2>
                  <p className="text-white font-semibold mb-2">
                    {selectedItem.fullGame || selectedItem.game}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {selectedItem.description}
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gray-400 text-xs">Owned by</span>
                    <span className="text-white font-bold">
                      {selectedItem.owner}
                    </span>
                    <button
                      onClick={() => alert("Chat feature coming soon!")}
                      className="ml-auto bg-[#3b2ff7] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold"
                    >
                      Chat
                    </button>
                  </div>
                  <div className="bg-[#2d2d3a] rounded-xl p-5 mb-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-white text-2xl font-bold">
                          {selectedItem.currentPrice}
                        </span>
                        <span className="text-gray-400 text-lg ml-2">ETH</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        ~ {selectedItem.usdPrice}
                      </span>
                    </div>
                    <span className="text-green-400 text-xs block mb-2">
                      {selectedItem.priceChange} from last week
                    </span>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleBuyNow(selectedItem)}
                        className="flex-1 bg-[#3b2ff7] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleMakeOffer(selectedItem)}
                        className="flex-1 border border-[#3b2ff7] hover:bg-[#232323] text-[#3b2ff7] py-3 rounded-lg font-semibold text-sm"
                      >
                        Make Offer
                      </button>
                    </div>
                  </div>
                  {/* Tabs */}
                  <div className="flex gap-2 mb-4">
                    {["Stats", "Traits", "History"].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-full font-medium text-sm border ${tab === "Stats" ? "bg-[#2d2d3a] text-white border-[#3b2ff7]" : "bg-[#232323] text-gray-400 border-gray-700"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {/* Item Stats */}
                  <div className="bg-[#2d2d3a] rounded-xl p-5">
                    <h4 className="text-[#3b2ff7] flex items-center gap-2 mb-4 text-sm font-semibold">
                      Item Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-[#232323] rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 text-xl">⚡</span>
                          <span className="text-white text-sm">Power</span>
                        </div>
                        <span className="text-white font-bold">
                          {selectedItem.power}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-[#232323] rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 text-xl">⚡</span>
                          <span className="text-white text-sm">Power</span>
                        </div>
                        <span className="text-white font-bold">
                          {selectedItem.power}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
