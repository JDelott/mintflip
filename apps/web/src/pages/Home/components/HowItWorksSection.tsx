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
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      imageBg: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 3,
      title: 'Sell',
      description: 'Set your price and licensing options',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      imageBg: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    
  ];

  return (
    <section className="mt-8">
      <h2 className="sectionheading">How MintFlip Works</h2>
      <div className="bg-background-elevated rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center p-4 bg-background rounded-lg overflow-hidden">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <img 
                  src={step.imageBg} 
                  alt={step.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=300&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-text-secondary text-sm">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="btnbase btnprimary">Get Started</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
