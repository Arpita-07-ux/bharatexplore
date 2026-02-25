import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams, BrowserRouter } from 'react-router-dom';
import { Search, MapPin, Heart, User, LogOut, Menu, X, ChevronRight, Star, Calendar, Info, Mail, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useAuthStore } from './store/authStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              BharatExplore
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Home</Link>
            <Link to="/states" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">States</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Dashboard</Link>
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-500">Hi, {user.name}</span>
                  <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium">Login</Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4"
          >
            <Link to="/" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/states" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>States</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block text-red-500 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-100 py-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <MapPin className="text-emerald-600 w-6 h-6" />
        <span className="text-xl font-bold text-gray-900">BharatExplore</span>
      </div>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Discover the hidden gems and vibrant culture of India. Your ultimate companion for exploring the soul of incredible India.
      </p>
      
      <div className="flex flex-col items-center space-y-3 mb-8">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Developer Contact</div>
        <div className="flex items-center space-x-6">
          <a 
            href="mailto:arpitakumarisahu222@gmail.com" 
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors"
            title="Email Developer"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">arpitakumarisahu222@gmail.com</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/arpita-kumari-sahu-19bb2234a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-sm">LinkedIn</span>
          </a>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        © 2026 BharatExplore. All rights reserved.
      </div>
    </div>
  </footer>
);

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(`/api/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
        <input
          type="text"
          placeholder="Search for states or places (e.g. Rajasthan, Jaipur)"
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl z-40 overflow-hidden"
          >
            {results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  navigate(item.type === 'state' ? `/state/${item.id}` : `/place/${item.id}`);
                  setQuery('');
                }}
                className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{item.type}</div>
                </div>
                <ChevronRight className="ml-auto w-4 h-4 text-gray-300" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Pages ---

const HomePage = () => {
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/states').then(res => setStates(res.data));
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/india/1920/1080" 
            alt="India" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Explore the Heart of <span className="text-emerald-400">India</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
          >
            From the majestic Himalayas to the serene backwaters of Kerala, discover the diverse beauty of the Indian subcontinent.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Featured States */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular States</h2>
            <p className="text-gray-500">Discover the unique culture and heritage of Indian states.</p>
          </div>
          <Link to="/states" className="text-emerald-600 font-semibold flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {states.map((state) => (
            <motion.div
              key={state.id}
              whileHover={{ y: -10 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
              onClick={() => window.location.href = `/state/${state.id}`}
            >
              <img src={state.image_url} alt={state.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{state.name}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {state.description}
                </p>
                <div className="flex items-center text-emerald-400 font-medium">
                  Explore Now <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const StatePage = () => {
  const { id } = useParams() as any;
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/states/${id}`).then(res => setState(res.data));
  }, [id]);

  if (!state) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-16">
      <div className="relative h-[50vh]">
        <img src={state.image_url} alt={state.name} className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white">{state.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">About {state.name}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{state.description}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Top Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.places.map((place: any) => (
                <Link 
                  key={place.id} 
                  to={`/place/${place.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={place.image_url} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{place.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{place.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" /> Culture & Heritage
            </h3>
            <p className="text-emerald-800/80 leading-relaxed">{state.culture}</p>
          </div>
          <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" /> Famous Cuisine
            </h3>
            <p className="text-orange-800/80 leading-relaxed">{state.cuisine}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlacePage = () => {
  const { id } = useParams() as any;
  const [place, setPlace] = useState<any>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const { user, token } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewMode, setViewMode] = useState<'info' | 'map'>('info');

  useEffect(() => {
    axios.get(`/api/places/${id}`).then(res => {
      setPlace(res.data);
      fetchHotels(res.data.name, res.data.latitude, res.data.longitude);
    });
    if (user && token) {
      axios.get('/api/favorites', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setIsFavorite(res.data.some((f: any) => f.id === parseInt(id)));
        });
    }
  }, [id, user, token]);

  const fetchHotels = async (placeName: string, lat: number, lng: number) => {
    setLoadingHotels(true);
    try {
      const res = await axios.get(`/api/hotels?place=${placeName}&lat=${lat}&lng=${lng}`);
      setHotels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHotels(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please login to save favorites");
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/favorites', { placeId: id }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (!place) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-16">
      <div className="relative h-[60vh]">
        <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="text-emerald-400 font-semibold mb-2 uppercase tracking-widest text-sm">{place.state_name}</div>
              <h1 className="text-5xl font-bold">{place.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20">
                <button 
                  onClick={() => setViewMode('info')}
                  className={cn(
                    "px-6 py-2 rounded-xl font-semibold transition-all",
                    viewMode === 'info' ? "bg-white text-emerald-600 shadow-sm" : "text-white hover:bg-white/10"
                  )}
                >
                  Details
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={cn(
                    "px-6 py-2 rounded-xl font-semibold transition-all",
                    viewMode === 'map' ? "bg-white text-emerald-600 shadow-sm" : "text-white hover:bg-white/10"
                  )}
                >
                  Map View
                </button>
              </div>
              <button 
                onClick={toggleFavorite}
                className={cn(
                  "p-4 rounded-2xl transition-all shadow-lg flex items-center space-x-2",
                  isFavorite ? "bg-rose-500 text-white" : "bg-white text-gray-900 hover:bg-gray-50"
                )}
              >
                <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
                <span className="hidden sm:inline font-semibold">{isFavorite ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {viewMode === 'info' ? (
            <motion.div 
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h2 className="text-3xl font-bold mb-6">Overview</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">{place.description}</p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-6">History</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">{place.history}</p>
                </section>

                {place.attractions.length > 0 && (
                  <section>
                    <h2 className="text-3xl font-bold mb-8">Key Attractions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {place.attractions.map((attr: any) => (
                        <div key={attr.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="text-xl font-bold mb-2">{attr.name}</h3>
                          <p className="text-gray-500 text-sm">{attr.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Nearby Hotels Section */}
                <section>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Nearby Hotels</h2>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">Powered by Gemini AI</div>
                  </div>
                  {loadingHotels ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hotels.map((hotel, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                            <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                              {hotel.priceRange}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{hotel.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-600" /> Best Time to Visit
                  </h3>
                  <p className="text-gray-600 text-lg">{place.best_time}</p>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-600" /> Location
                  </h3>
                  <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => setViewMode('map')}>
                    <img 
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=13&size=400x400&key=YOUR_API_KEY`} 
                      alt="Map Placeholder"
                      className="w-full h-full object-cover opacity-50 grayscale"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://picsum.photos/seed/map/400/300?grayscale";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg">Open Map View</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-[70vh] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative"
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${place.latitude},${place.longitude}&zoom=14`}
                allowFullScreen
                onError={(e) => {
                  // Fallback to a simple search link if embed fails (e.g. no key)
                  console.log("Map embed failed, likely missing API key");
                }}
              ></iframe>
              {/* Fallback Overlay for Demo (since we don't have a real Google Maps API Key) */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/50">
                <h3 className="font-bold text-gray-900">{place.name}</h3>
                <p className="text-sm text-gray-500">{place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-emerald-600 font-bold text-sm hover:underline pointer-events-auto"
                >
                  View on Google Maps ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, token } = useAuthStore();
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    axios.get('/api/favorites', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setFavorites(res.data));
  }, [user, token, navigate]);

  const removeFavorite = async (id: number) => {
    try {
      await axios.delete(`/api/favorites/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
        <p className="text-gray-500">Manage your saved destinations and plan your next adventure.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-rose-500 fill-current" /> My Favorites
        </h2>
        {favorites.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">You haven't saved any places yet.</p>
            <Link to="/" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((place) => (
              <div key={place.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group">
                <div className="relative h-56">
                  <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeFavorite(place.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">{place.state_name}</div>
                  <h3 className="text-xl font-bold mb-4">{place.name}</h3>
                  <Link 
                    to={`/place/${place.id}`}
                    className="w-full block text-center py-3 bg-gray-50 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const AuthPage = ({ type }: { type: 'login' | 'register' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(endpoint, formData);
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
            <User className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-gray-500 mt-2">{type === 'login' ? 'Enter your details to sign in' : 'Join our community of explorers'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]"
          >
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500">
          {type === 'login' ? (
            <p>Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Register</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Login</Link></p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const StatesPage = () => {
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/states').then(res => setStates(res.data));
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore All States</h1>
        <p className="text-gray-500">Discover the diverse culture and beauty across the Indian subcontinent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {states.map((state) => (
          <motion.div
            key={state.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            onClick={() => window.location.href = `/state/${state.id}`}
          >
            <div className="h-64 overflow-hidden">
              <img src={state.image_url} alt={state.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">{state.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6">{state.description}</p>
              <div className="flex items-center text-emerald-600 font-semibold">
                Explore State <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/register" element={<AuthPage type="register" />} />
            <Route path="/state/:id" element={<StatePage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/states" element={<StatesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
