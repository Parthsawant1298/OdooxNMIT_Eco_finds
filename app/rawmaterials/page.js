"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Header';
import { ArrowUpRight, ChevronDown, ChevronRight, CreditCard, Filter, Grid, Heart, List, Package, Percent, Search, Share, ShoppingCart, Sliders, Star, Tag, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function RawMaterialsPage() {
  const router = useRouter();
  const [rawMaterials, setRawMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const filterPanelRef = useRef(null);
  
  // Filter states
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [ratings, setRatings] = useState(0); // Minimum rating filter
  const [discount, setDiscount] = useState(false); // Show only discounted items
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Animation states
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);
  
  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Fetching raw materials...');
        
        const response = await fetch('/api/rawmaterials/available');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch raw materials');
        }

        console.log('📊 Raw materials data:', data);
        
        // Filter out materials without proper createdBy data first
        const validMaterials = data.rawMaterials?.filter(material => 
          material && material.createdBy && material.createdBy._id && 
          (material.createdBy.sellerName || material.createdBy.name)
        ) || [];
        
        console.log(`📊 Total materials: ${data.rawMaterials?.length || 0}, Valid materials: ${validMaterials.length}`);
        setRawMaterials(validMaterials);
        
        // Extract unique categories DYNAMICALLY from valid materials
        const uniqueCategories = [...new Set(validMaterials.map(material => material.category).filter(Boolean))];
        console.log('🏷️ Dynamic categories found:', uniqueCategories);
        setCategories(uniqueCategories);
        
        // Extract subcategories grouped by category DYNAMICALLY
        const subcategoryMap = {};
        uniqueCategories.forEach(category => {
          const materialsInCategory = validMaterials.filter(material => material.category === category);
          const uniqueSubcategories = [...new Set(materialsInCategory.map(material => 
            material.subcategory).filter(Boolean))];
          subcategoryMap[category] = uniqueSubcategories;
        });
        console.log('🏷️ Dynamic subcategories found:', subcategoryMap);
        setSubcategories(subcategoryMap);
        
        // Extract unique users (sellers) DYNAMICALLY - No duplicates
        const userMap = new Map();
        validMaterials.forEach(material => {
          if (material.createdBy && material.createdBy._id) {
            const userName = material.createdBy.sellerName || material.createdBy.name || 'Unknown Seller';
            userMap.set(material.createdBy._id, {
              id: material.createdBy._id,
              name: userName
            });
          }
        });
        const dynamicUsers = Array.from(userMap.values());
        console.log('👥 Dynamic users found:', dynamicUsers);
        setUsers(dynamicUsers);
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('rawMaterialFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        setError('');
      } catch (error) {
        console.error('❌ Error fetching raw materials:', error);
        setError(error.message);
        // Reset to empty arrays on error
        setRawMaterials([]);
        setCategories([]);
        setSubcategories({});
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRawMaterials();
    
    // Close filter panel when clicking outside
    const handleClickOutside = (event) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target) && 
          !event.target.closest('button[data-filter-toggle]')) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setSelectedSubcategory('all');
    }
  }, [selectedCategory]);
  
  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedSubcategory !== 'all') count++;
    if (selectedUser !== 'all') count++;
    if (searchQuery) count++;
    if (priceRange.min > 0 || priceRange.max < 20000) count++;
    if (ratings > 0) count++;
    if (discount) count++;
    if (showFavoritesOnly) count++;
    if (selectedFeatures.length > 0) count++;
    
    setActiveFilters(count);
  }, [selectedCategory, selectedSubcategory, selectedUser, searchQuery, priceRange, ratings, discount, showFavoritesOnly, selectedFeatures]);

  // Check if user is logged in
  // Replace the existing checkAuth function with this:
const checkAuth = async () => {
  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    const userData = await response.json();
    return userData.success && !!userData.user;
  } catch (error) {
    return false;
  }
}

// Update handleAddToCart function:
const handleAddToCart = async (materialId) => {
  try {
    console.log('🛒 Adding to cart, material ID:', materialId);
    
    // Check if user is logged in
    const isLoggedIn = await checkAuth();
    if (!isLoggedIn) {
      console.log('❌ User not logged in, redirecting...');
      router.push('/login?redirectTo=/rawmaterials&message=Please login to add items to cart');
      return;
    }

    console.log('✅ User is logged in, making cart request...');
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        rawMaterialId: materialId,
        quantity: 1
      }),
    });

    console.log('📡 Cart API response status:', response.status);
    console.log('📡 Cart API response headers:', response.headers);

    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Non-JSON response received:', contentType);
      const text = await response.text();
      console.error('❌ Response text:', text);
      throw new Error('Server returned invalid response format');
    }

    let data;
    try {
      data = await response.json();
      console.log('📊 Cart API response data:', data);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      const text = await response.text();
      console.error('❌ Raw response:', text);
      throw new Error('Failed to parse server response');
    }

    if (!response.ok) {
      console.error('❌ Cart API error:', data);
      throw new Error(data?.error || data?.details || 'Failed to add item to cart');
    }

    // Show toast notification instead of alert
    console.log('✅ Successfully added to cart');
    showToast('Raw material added to cart!', 'success');
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    showToast(error.message || 'Failed to add to cart', 'error');
  }
};

// Update handleBuyNow function:
const handleBuyNow = async (materialId) => {
  try {
    // Check if user is logged in
    const isLoggedIn = await checkAuth();
    if (!isLoggedIn) {
      router.push('/login?redirectTo=/rawmaterials&message=Please login to make a purchase');
      return;
    }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        rawMaterialId: materialId,
        quantity: 1
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to cart');
    }

    // Redirect to checkout
    router.push('/checkout');
  } catch (error) {
    console.error('Buy now error:', error);
    showToast(error.message || 'Failed to process. Please try again.', 'error');
  }
};
  
  const handleShare = (material) => {
    if (navigator.share) {
      navigator.share({
        title: material.name,
        text: `Check out this ${material.name}!`,
        url: window.location.origin + `/rawmaterials/${material._id}`
      })
      .catch(error => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      const shareUrl = `${window.location.origin}/rawmaterials/${material._id}`;
      prompt('Copy this link to share:', shareUrl);
    }
  };
  
  const toggleFavorite = (materialId) => {
    let newFavorites;
    if (favorites.includes(materialId)) {
      newFavorites = favorites.filter(id => id !== materialId);
    } else {
      newFavorites = [...favorites, materialId];
      showToast('Added to favorites! Favorites are stored locally on this device.', 'success');
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('rawMaterialFavorites', JSON.stringify(newFavorites));
  };
  
  // Toast notification
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-fade-in-up ${
      type === 'success' ? 'bg-teal-600' : 
      type === 'error' ? 'bg-red-600' : 
      'bg-blue-600'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };
  
  // Filter functions
  const filterRawMaterials = useCallback(() => {
    if (!rawMaterials.length) return [];
    
    return rawMaterials.filter(material => {
      // Category filter
      if (selectedCategory !== 'all' && material.category !== selectedCategory) {
        return false;
      }
      
      // Subcategory filter
      if (selectedSubcategory !== 'all' && material.subcategory !== selectedSubcategory) {
        return false;
      }

      // user filter
      if (selectedUser !== 'all' && (!material.createdBy || material.createdBy._id !== selectedUser)) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !material.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !material.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (material.price < priceRange.min || material.price > priceRange.max) {
        return false;
      }
      
      // Rating filter
      if (ratings > 0 && material.ratings < ratings) {
        return false;
      }
      
      // Discount filter
      if (discount && (!material.discount || material.discount <= 0)) {
        return false;
      }
      
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(material._id)) {
        return false;
      }
      
      // Feature filter
      if (selectedFeatures.length > 0 && !selectedFeatures.some(feature => 
        material.features && Array.isArray(material.features) && material.features.includes(feature))) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort materials
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.ratings - a.ratings;
        case 'popularity':
          return b.numReviews - a.numReviews;
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [rawMaterials, selectedCategory, selectedSubcategory, selectedUser, searchQuery, priceRange, sortBy, ratings, discount, showFavoritesOnly, favorites, selectedFeatures]);
  
  const filteredRawMaterials = filterRawMaterials();
  
  // Group materials by user and category and subcategory
  const groupedMaterials = useCallback(() => {
    const grouped = {};
    
    if (selectedUser !== 'all') {
      // Group by user when a specific user is selected
      const user = users.find(s => s.id === selectedUser);
      if (user) {
        grouped[user.name] = {};
        
        if (selectedCategory !== 'all') {
          // Group by category under the user
          grouped[user.name][selectedCategory] = {};
          const materialsInCategory = filteredRawMaterials.filter(m => m.category === selectedCategory);
          
          if (selectedSubcategory !== 'all') {
            // Group by specific subcategory
            const materialsInSubcategory = materialsInCategory.filter(m => m.subcategory === selectedSubcategory);
            if (materialsInSubcategory.length > 0) {
              grouped[user.name][selectedCategory][selectedSubcategory] = materialsInSubcategory;
            }
          } else {
            // Group by all subcategories in the category
            const subcategoriesInCategory = [...new Set(materialsInCategory.map(m => m.subcategory).filter(Boolean))];
            subcategoriesInCategory.forEach(subcategory => {
              const materialsInSubcategory = materialsInCategory.filter(m => m.subcategory === subcategory);
              if (materialsInSubcategory.length > 0) {
                grouped[user.name][selectedCategory][subcategory] = materialsInSubcategory;
              }
            });
          }
        } else {
          // Group by all categories under the user
          categories.forEach(category => {
            const materialsInCategory = filteredRawMaterials.filter(m => m.category === category);
            if (materialsInCategory.length > 0) {
              grouped[user.name][category] = {};
              
              // Group by subcategories within each category
              const subcategoriesInCategory = [...new Set(materialsInCategory.map(m => m.subcategory).filter(Boolean))];
              subcategoriesInCategory.forEach(subcategory => {
                const materialsInSubcategory = materialsInCategory.filter(m => m.subcategory === subcategory);
                if (materialsInSubcategory.length > 0) {
                  grouped[user.name][category][subcategory] = materialsInSubcategory;
                }
              });
            }
          });
        }
      }
    } else {
      // Group by user first, then by category, then by subcategory
      users.forEach(user => {
        const materialsFromuser = filteredRawMaterials.filter(m => m.createdBy && m.createdBy._id === user.id);
        
        if (materialsFromuser.length > 0) {
          grouped[user.name] = {};
          
          if (selectedCategory !== 'all') {
            // Only show selected category
            const materialsInCategory = materialsFromuser.filter(m => m.category === selectedCategory);
            if (materialsInCategory.length > 0) {
              grouped[user.name][selectedCategory] = {};
              
              if (selectedSubcategory !== 'all') {
                // Only show selected subcategory
                const materialsInSubcategory = materialsInCategory.filter(m => m.subcategory === selectedSubcategory);
                if (materialsInSubcategory.length > 0) {
                  grouped[user.name][selectedCategory][selectedSubcategory] = materialsInSubcategory;
                }
              } else {
                // Group by all subcategories in the category
                const subcategoriesInCategory = [...new Set(materialsInCategory.map(m => m.subcategory).filter(Boolean))];
                subcategoriesInCategory.forEach(subcategory => {
                  const materialsInSubcategory = materialsInCategory.filter(m => m.subcategory === subcategory);
                  if (materialsInSubcategory.length > 0) {
                    grouped[user.name][selectedCategory][subcategory] = materialsInSubcategory;
                  }
                });
              }
            }
          } else {
            // Group by all categories
            categories.forEach(category => {
              const materialsInCategory = materialsFromuser.filter(m => m.category === category);
              if (materialsInCategory.length > 0) {
                grouped[user.name][category] = {};
                
                // Group by subcategories within each category
                const subcategoriesInCategory = [...new Set(materialsInCategory.map(m => m.subcategory).filter(Boolean))];
                subcategoriesInCategory.forEach(subcategory => {
                  const materialsInSubcategory = materialsInCategory.filter(m => m.subcategory === subcategory);
                  if (materialsInSubcategory.length > 0) {
                    grouped[user.name][category][subcategory] = materialsInSubcategory;
                  }
                });
              }
            });
          }
        }
      });
    }
    
    return grouped;
  }, [filteredRawMaterials, selectedUser, selectedCategory, selectedSubcategory, users, categories]);
  
  const materialsByuser = groupedMaterials();
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedUser('all');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 20000 });
    setSortBy('newest');
    setRatings(0);
    setDiscount(false);
    setShowFavoritesOnly(false);
    setSelectedFeatures([]);
    
    // Animation for filter reset
    setIsFilterAnimating(true);
    setTimeout(() => setIsFilterAnimating(false), 500);
  };
  
  const handleFeatureToggle = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-teal-700 animate-pulse">Loading raw materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-white">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <X size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
          <p className="text-gray-600 mb-6">We couldn't load the raw materials. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pb-16">
        {/* Page Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Raw Materials Marketplace</h1>
          <p className="text-gray-600">Discover quality raw materials from verified users</p>
        </div>

        {/* Main content with sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Sliders size={18} className="mr-2 text-teal-600" />
                  Filters
                </h2>
                {activeFilters > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {/* users */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Sellers ({users.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div 
                      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedUser === 'all' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedUser('all')}
                    >
                      <User size={16} className="mr-2" />
                      <span>All Sellers</span>
                    </div>
                    {users.length === 0 ? (
                      <div className="text-sm text-gray-500 px-3 py-2">
                        No sellers found. Add some materials first!
                      </div>
                    ) : (
                      users.map(user => (
                        <div 
                          key={user.id}
                          className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedUser === user.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <User size={16} className="mr-2" />
                          <span className="truncate">{user.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Categories ({categories.length})</h3>
                  <div className="space-y-2">
                    <div 
                      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedCategory === 'all' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedSubcategory('all');
                      }}
                    >
                      <Package size={16} className="mr-2" />
                      <span>All Categories</span>
                    </div>
                    {categories.length === 0 ? (
                      <div className="text-sm text-gray-500 px-3 py-2">
                        No categories found. Add some materials first!
                      </div>
                    ) : (
                      categories.map(category => (
                      <div key={category}>
                        <div 
                          className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedCategory === category ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory('all');
                          }}
                        >
                          <span>{category}</span>
                        </div>
                        
                        {/* Subcategories */}
                        {selectedCategory === category && subcategories[category] && subcategories[category].length > 0 && (
                          <div className="ml-6 mt-2 space-y-1">
                            <div
                              className={`flex items-center px-3 py-1 text-sm rounded-md cursor-pointer ${selectedSubcategory === 'all' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                              onClick={() => setSelectedSubcategory('all')}
                            >
                              <span>All {category}</span>
                            </div>
                            {subcategories[category].map(subcategory => (
                              <div 
                                key={subcategory}
                                className={`flex items-center px-3 py-1 text-sm rounded-md cursor-pointer ${selectedSubcategory === subcategory ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                                onClick={() => setSelectedSubcategory(subcategory)}
                              >
                                <ChevronRight size={12} className="mr-1" />
                                <span>{subcategory}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                  <div className="px-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-full">
                        <input
                          type="range"
                          min="0"
                          max="20000"
                          step="100"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 20000 })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Ratings */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Ratings</h3>
                  <div className="space-y-2">
                    {[0, 4, 3, 2, 1].map((rating) => (
                      <div 
                        key={rating}
                        className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${ratings === rating ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                        onClick={() => setRatings(rating)}
                      >
                        {rating === 0 ? (
                          <span>All Ratings</span>
                        ) : (
                          <>
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  fill={i < rating ? "currentColor" : "none"} 
                                  stroke="currentColor" 
                                />
                              ))}
                            </div>
                            <span>& Up</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Special Filters */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Special Filters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="discount-filter"
                        checked={discount}
                        onChange={() => setDiscount(!discount)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="discount-filter" className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center">
                        <Percent size={14} className="mr-1 text-red-500" />
                        Discounted Items
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="favorites-filter"
                        checked={showFavoritesOnly}
                        onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="favorites-filter" className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center">
                        <Heart size={14} className="mr-1 text-red-500" fill={showFavoritesOnly ? "currentColor" : "none"} />
                        Favorites Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and filter bar */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search raw materials..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Filter toggle (mobile) */}
                <button
                  data-filter-toggle="true"
                  className="lg:hidden flex items-center justify-center space-x-2 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
                  onClick={toggleFilterPanel}
                >
                  <Filter size={18} />
                  <span>Filters {activeFilters > 0 && `(${activeFilters})`}</span>
                </button>
                
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
                
                {/* View mode toggle */}
                <div className="hidden md:flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Filter Panel (mobile) */}
            {isFilterOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden flex justify-end">
                <div 
                  ref={filterPanelRef}
                  className="w-full max-w-xs bg-white h-full overflow-y-auto shadow-xl animate-slide-in-right"
                >
                  <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                      <Sliders size={18} className="mr-2 text-teal-600" />
                      Filters
                    </h2>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-6">
                    {/* Mobile filters - same as desktop */}
                    {/* Users */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Sellers ({users.length})</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        <div 
                          className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedUser === 'all' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedUser('all')}
                        >
                          <User size={16} className="mr-2" />
                          <span>All Sellers</span>
                        </div>
                        {users.length === 0 ? (
                          <div className="text-sm text-gray-500 px-3 py-2">
                            No sellers found. Add some materials first!
                          </div>
                        ) : (
                          users.map(user => (
                            <div 
                              key={user.id}
                              className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedUser === user.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                              onClick={() => setSelectedUser(user.id)}
                            >
                              <User size={16} className="mr-2" />
                              <span className="truncate">{user.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Categories for mobile */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Categories ({categories.length})</h3>
                      <div className="space-y-2">
                        <div 
                          className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedCategory === 'all' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            setSelectedCategory('all');
                            setSelectedSubcategory('all');
                          }}
                        >
                          <Package size={16} className="mr-2" />
                          <span>All Categories</span>
                        </div>
                        
                        {categories.length === 0 ? (
                          <div className="text-sm text-gray-500 px-3 py-2">
                            No categories found. Add some materials first!
                          </div>
                        ) : (
                          categories.map(category => (
                          <div key={category}>
                            <div 
                              className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${selectedCategory === category ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                              onClick={() => {
                                setSelectedCategory(category);
                                setSelectedSubcategory('all');
                              }}
                            >
                              <span>{category}</span>
                            </div>
                            
                            {/* Subcategories for mobile */}
                            {selectedCategory === category && subcategories[category] && subcategories[category].length > 0 && (
                              <div className="ml-6 mt-2 space-y-1">
                                <div
                                  className={`flex items-center px-3 py-1 text-sm rounded-md cursor-pointer ${selectedSubcategory === 'all' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                                  onClick={() => setSelectedSubcategory('all')}
                                >
                                  <span>All {category}</span>
                                </div>
                                {subcategories[category].map(subcategory => (
                                  <div 
                                    key={subcategory}
                                    className={`flex items-center px-3 py-1 text-sm rounded-md cursor-pointer ${selectedSubcategory === subcategory ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedSubcategory(subcategory)}
                                  >
                                    <ChevronRight size={12} className="mr-1" />
                                    <span>{subcategory}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t sticky bottom-0 bg-white flex justify-between">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Filter chips */}
            <div className={`flex flex-wrap gap-2 mb-6 ${isFilterAnimating ? 'animate-pulse' : ''}`}>
              {selectedUser !== 'all' && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  user: {users.find(s => s.id === selectedUser)?.name}
                  <button 
                    onClick={() => setSelectedUser('all')}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {selectedCategory !== 'all' && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {selectedSubcategory !== 'all' && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Subcategory: {selectedSubcategory}
                  <button 
                    onClick={() => setSelectedSubcategory('all')}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Search: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(priceRange.min > 0 || priceRange.max < 20000) && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Price: ₹{priceRange.min} - ₹{priceRange.max}
                  <button 
                    onClick={() => setPriceRange({ min: 0, max: 20000 })}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {ratings > 0 && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {ratings}+ Stars
                  <button 
                    onClick={() => setRatings(0)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {discount && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Discounted
                  <button 
                    onClick={() => setDiscount(false)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {showFavoritesOnly && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Favorites
                  <button 
                    onClick={() => setShowFavoritesOnly(false)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {selectedFeatures.length > 0 && (
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Features: {selectedFeatures.length}
                  <button 
                    onClick={() => setSelectedFeatures([])}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {activeFilters > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-teal-600 underline text-sm hover:text-teal-800"
                >
                  Clear All Filters
                </button>
              )}
            </div>
            
            {/* Empty state */}
            {filteredRawMaterials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                {rawMaterials.length === 0 ? (
                  // No materials at all
                  <>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No raw materials available</h2>
                    <p className="text-gray-500">Check back later for new materials.</p>
                  </>
                ) : (
                  // Materials exist but none match filters
                  <>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No raw materials found</h2>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Materials by user and category and subcategory */
              <div className="space-y-10">
                {Object.entries(materialsByuser).map(([userName, categoryGroups]) => (
                  <div key={`user-${userName}`} className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* user header */}
                    <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={20} className="mr-3" />
                        <h2 className="text-xl font-bold">{userName}</h2>
                      </div>
                      {selectedUser === 'all' && (
                        <button 
                          onClick={() => {
                            const user = users.find(s => s.name === userName);
                            if (user) setSelectedUser(user.id);
                          }}
                          className="flex items-center text-sm bg-white text-teal-700 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          View All
                          <ArrowUpRight size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                    
                    {/* Categories under user */}
                    <div className="p-4 space-y-8">
                      {Object.entries(categoryGroups).map(([category, subcategoryGroups]) => (
                        <div key={`${userName}-${category}`} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                          {/* Category header */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                              <Tag size={16} className="mr-2 text-teal-600" />
                              {category}
                              <span className="ml-2 text-sm text-gray-500">
                                ({Object.values(subcategoryGroups).reduce((acc, materials) => acc + materials.length, 0)} items)
                              </span>
                            </h3>
                            
                            {selectedCategory !== category && (
                              <button 
                                onClick={() => {
                                  setSelectedCategory(category);
                                }}
                                className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
                              >
                                View All
                                <ArrowUpRight size={14} className="ml-1" />
                              </button>
                            )}
                          </div>
                          
                          {/* Subcategories under category */}
                          <div className="space-y-6">
                            {Object.entries(subcategoryGroups).map(([subcategory, materials]) => (
                              <div key={`${userName}-${category}-${subcategory}`} className="ml-4">
                                {/* Subcategory header */}
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-md font-medium text-gray-700 flex items-center">
                                    <Package size={14} className="mr-2 text-gray-500" />
                                    {subcategory}
                                    <span className="ml-2 text-sm text-gray-400">({materials.length} items)</span>
                                  </h4>
                                  
                                  {selectedSubcategory !== subcategory && (
                                    <button 
                                      onClick={() => {
                                        setSelectedSubcategory(subcategory);
                                      }}
                                      className="text-xs text-teal-600 hover:text-teal-800 flex items-center"
                                    >
                                      View All
                                      <ArrowUpRight size={12} className="ml-1" />
                                    </button>
                                  )}
                                </div>
                        
                                {/* Materials grid or list */}
                                {viewMode === 'grid' ? (
                                  // Grid View
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {materials.map((material, index) => (
                                      <div key={`${material._id}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group max-w-md mx-auto">
                                        <div 
                                          className="h-56 bg-gray-100 relative cursor-pointer overflow-hidden"
                                          onClick={() => router.push(`/rawmaterials/${material._id}`)}
                                        >
                                          <img 
                                            src={material.mainImage || "/placeholder.svg"} 
                                            alt={material.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          />
                                          
                                          {material.discount > 0 && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                              {material.discount}% OFF
                                            </div>
                                          )}
                                          
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleFavorite(material._id);
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                          >
                                            <Heart 
                                              size={16} 
                                              className={favorites.includes(material._id) ? "text-red-500 fill-current" : "text-gray-400"} 
                                            />
                                          </button>
                                        </div>
                                        
                                        <div className="p-5">
                                          <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-lg">{material.name}</h3>
                                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                                          
                                          <div className="flex items-center mb-2">
                                            <div className="flex text-yellow-400">
                                              {[...Array(5)].map((_, i) => (
                                                <Star 
                                                  key={`${material._id}-star-${i}`}
                                                  size={14} 
                                                  fill={i < Math.round(material.ratings || 0) ? "currentColor" : "none"}
                                                  stroke="currentColor" 
                                                />
                                              ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">
                                              {material.ratings ? material.ratings.toFixed(1) : '0.0'} ({material.numReviews || 0})
                                            </span>
                                          </div>
                                          
                                          <div className="flex flex-col space-y-3">
                                            <div className="flex items-center justify-between">
                                              <div className="flex flex-col">
                                                <span className="text-lg font-bold text-gray-900">₹{material.price.toLocaleString()}</span>
                                                {material.originalPrice && material.originalPrice > material.price && (
                                                  <span className="text-sm text-gray-500 line-through">₹{material.originalPrice.toLocaleString()}</span>
                                                )}
                                              </div>
                                              
                                              <button
                                                onClick={() => handleShare(material)}
                                                className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors"
                                              >
                                                <Share size={16} />
                                              </button>
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={() => handleAddToCart(material._id)}
                                                className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center space-x-1"
                                              >
                                                <ShoppingCart size={16} />
                                                <span className="text-sm">Add to Cart</span>
                                              </button>
                                              <button
                                                onClick={() => handleBuyNow(material._id)}
                                                className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-1"
                                              >
                                                <CreditCard size={16} />
                                                <span className="text-sm">Buy Now</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  // List View
                                  <div className="space-y-6">
                                    {materials.map((material, index) => (
                                      <div key={`${material._id}-list-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col sm:flex-row max-w-4xl mx-auto">
                                        <div 
                                          className="sm:w-56 h-48 sm:h-36 bg-gray-100 relative cursor-pointer overflow-hidden flex-shrink-0"
                                          onClick={() => router.push(`/rawmaterials/${material._id}`)}
                                        >
                                          <img 
                                            src={material.mainImage || "/placeholder.svg"} 
                                            alt={material.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          />
                                          
                                          {material.discount > 0 && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                              {material.discount}% OFF
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                          <div>
                                            <h3 className="font-semibold text-gray-800 mb-3 text-lg">{material.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                                            
                                            <div className="flex items-center mb-2">
                                              <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star 
                                                    key={`${material._id}-list-star-${i}`}
                                                    size={14} 
                                                    fill={i < Math.round(material.ratings || 0) ? "currentColor" : "none"}
                                                    stroke="currentColor" 
                                                  />
                                                ))}
                                              </div>
                                              <span className="text-xs text-gray-500 ml-1">
                                                {material.ratings ? material.ratings.toFixed(1) : '0.0'} ({material.numReviews || 0})
                                              </span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center justify-between mt-4">
                                            <div className="flex flex-col">
                                              <span className="text-lg font-bold text-gray-900">₹{material.price.toLocaleString()}</span>
                                              {material.originalPrice && material.originalPrice > material.price && (
                                                <span className="text-sm text-gray-500 line-through">₹{material.originalPrice.toLocaleString()}</span>
                                              )}
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleFavorite(material._id);
                                                }}
                                                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                              >
                                                <Heart 
                                                  size={16} 
                                                  className={favorites.includes(material._id) ? "text-red-500 fill-current" : "text-gray-400"} 
                                                />
                                              </button>
                                              <button
                                                onClick={() => handleAddToCart(material._id)}
                                                className="bg-teal-600 text-white px-3 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-1"
                                              >
                                                <ShoppingCart size={16} />
                                                <span className="text-sm">Add to Cart</span>
                                              </button>
                                              <button
                                                onClick={() => handleBuyNow(material._id)}
                                                className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-1"
                                              >
                                                <CreditCard size={16} />
                                                <span className="text-sm">Buy Now</span>
                                              </button>
                                              <button
                                                onClick={() => handleShare(material)}
                                                className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors"
                                              >
                                                <Share size={16} />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        
        .animate-fade-out {
          animation: fade-out 0.3s ease-out;
        }
      `}</style>
      
      <Footer />
    </div>
  );
}