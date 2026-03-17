import React from 'react'

export default function Card() {
    return (
        <div className="w-full group bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] hover-brutal relative z-10">
            <div className="block overflow-hidden border-b-[3px] border-[var(--border-color)] relative">
                <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10 mix-blend-multiply"></div>
                <img 
                  className="w-full h-80 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0" 
                  src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Editorial Subject" 
                />
            </div>
            
            <div className="p-8 flex flex-col gap-8">
                <div>
                    <h5 className="font-display text-5xl leading-[0.9] uppercase hover:text-[var(--accent)] transition-colors duration-300">
                        Condensed <br/> <span className="text-[var(--accent)]">Variables</span>
                    </h5>
                    <p className="mt-4 text-xs uppercase tracking-[0.15em] font-bold opacity-60">
                      Condensed variables reduce the complexity of a system by combining multiple physical parameters into fewer dimensionless forms, making analysis and comparison across different conditions easier.
                    </p>
                </div>

                <div className="flex items-end justify-between pt-4 border-t-[3px] border-[var(--border-color)]">
                    <span className="font-display text-5xl text-[var(--accent)]">$500</span>
                    <button className="text-[var(--bg-color)] bg-[var(--text-color)] hover:bg-[var(--accent)] font-bold uppercase tracking-widest text-xs px-8 py-4 border-[3px] border-transparent transition-all duration-300">
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}