const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: 'Create',
      description: 'Upload your AI-generated music and artwork',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      imageBg: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 2,
      title: 'Mint',
      description: 'Mint your music as an NFT with license terms',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      imageBg: "https://images.unsplash.com/photo-1639322537231-2f206e06af84?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 3,
      title: 'Sell',
      description: 'Sell licenses and earn royalties',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      imageBg: "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?q=80&w=300&auto=format&fit=crop"
    },
  ];

  return (
    <section className="my-16">
      <h2 className="sectionheading">How MintFlip Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.id} className="relative p-6 rounded-xl bg-background-elevated border border-background-highlight group hover:border-primary transition-colors">
            <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-5 overflow-hidden">
              <img src={step.imageBg} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 cursor-pointer">
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2 cursor-pointer">{step.title}</h3>
              <p className="text-text-secondary cursor-pointer">{step.description}</p>
              <div className="mt-6">
                <button className="text-primary font-semibold text-sm flex items-center cursor-pointer">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
