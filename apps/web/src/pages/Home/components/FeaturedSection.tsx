const FeaturedSection = () => {
  const featuredPlaylist = {
    title: "Today's Top Hits",
    description: "The biggest hits right now",
    coverImage: "https://via.placeholder.com/800x400/333/fff?text=Today's+Top+Hits",
  };

  return (
    <div className="relative h-80 rounded-lg overflow-hidden">
      <img
        src={featuredPlaylist.coverImage}
        alt={featuredPlaylist.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black-80 to-transparent flex flex-col justify-end p-8">
        <h2 className="text-5xl font-bold mb-3">{featuredPlaylist.title}</h2>
        <p className="text-xl mb-6 text-text-secondary">{featuredPlaylist.description}</p>
        <div className="flex space-x-4">
          <button className="btnbase btnprimary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play
          </button>
          <button className="btnbase btnsecondary">Save</button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
