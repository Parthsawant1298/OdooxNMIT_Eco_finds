// components/Header.jsx - UPDATED with Order History
"use client"
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Menu, Package, Plus, ShoppingCart, User, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
 const router = useRouter()
 const [isOpen, setIsOpen] = useState(false)
 const [user, setUser] = useState(null)
 const [cartItemCount, setCartItemCount] = useState(0)
 const [isLoading, setIsLoading] = useState(true)
 const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
 const profileMenuRef = useRef(null)
 
 const closeMenu = () => setIsOpen(false)
 
 useEffect(() => {
   const checkAuth = async (bypassCache = false) => {
     try {
       const url = bypassCache ? '/api/auth/user?bypassCache=true' : '/api/auth/user';
       const response = await fetch(url, {
         credentials: 'include'
       })
       if (response.ok) {
         const data = await response.json()
         if (data.success && data.user) {
           setUser(data.user)
           await fetchCartCount()
         }
       }
     } catch (error) {
       // Silently handle auth check failure
       setUser(null)
       setCartItemCount(0)
     } finally {
       setIsLoading(false)
     }
   }
   
   const handleUserProfileUpdated = (event) => {
     // Refresh user data when profile is updated
     checkAuth(true);
   }
   
   // Listen for profile update events
   window.addEventListener('userProfileUpdated', handleUserProfileUpdated);
   
   checkAuth();
   
   return () => {
     window.removeEventListener('userProfileUpdated', handleUserProfileUpdated);
   }
 }, [])
 
 const fetchCartCount = async () => {
   try {
     const response = await fetch('/api/cart', {
       credentials: 'include'
     })
     if (response.ok) {
       const data = await response.json()
       
       if (data.success && data.cart && data.cart.items) {
         let totalItems = 0
         data.cart.items.forEach(item => {
           totalItems += item.quantity
         })
         setCartItemCount(totalItems)
       } else {
         setCartItemCount(0)
       }
     } else {
       setCartItemCount(0)
     }
   } catch (error) {
     // Silently handle cart fetch failure
     setCartItemCount(0)
   }
 }
 
 useEffect(() => {
   const handleClickOutside = (event) => {
     if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
       setIsProfileMenuOpen(false)
     }
   }
   
   document.addEventListener('mousedown', handleClickOutside)
   return () => {
     document.removeEventListener('mousedown', handleClickOutside)
   }
 }, [])
 
 const handleLogout = async () => {
   try {
     await fetch('/api/auth/logout', {
       method: 'POST',
       credentials: 'include'
     })
     setUser(null)
     setIsProfileMenuOpen(false)
     setCartItemCount(0)
     router.push('/')
   } catch (error) {
     // Handle logout error gracefully
     setUser(null)
     setIsProfileMenuOpen(false)
     setCartItemCount(0)
     router.push('/')
   }
 }
 
 const handleCartClick = (e) => {
   if (!user) {
     e.preventDefault()
     router.push('/login?redirectTo=/cart&message=Please login to view your cart')
   }
 }
 
 return (
   <motion.header
     className="bg-white shadow-lg sticky top-0 z-50"
     style={{ borderBottom: '2px solid #347433' }}
     initial={{ y: -100 }}
     animate={{ y: 0 }}
     transition={{ type: 'spring', stiffness: 300, damping: 30 }}
   >
     <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
       <Link href="/" className="text-lg sm:text-xl font-bold flex items-center group flex-shrink-0" style={{color: '#347433'}}>
      <Image 
        src="/logo.svg" 
        alt="EcoFinds Logo" 
        width={32}
        height={32}
        className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" 
      />
      <span className="font-poppins tracking-tight text-sm sm:text-lg lg:text-xl">EcoFinds</span>
      </Link>
       {/* Main navigation */}
       <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 mx-auto">
         <Link href="/" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group">
           Home
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/rawmaterials" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group">
           Browse Items
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/dashboard" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group flex items-center">
           <Package size={14} className="mr-1 xl:mr-1" />
           Dashboard
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/add-raw-material" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group flex items-center">
           <Plus size={14} className="mr-1 xl:mr-1" />
           Sell Item
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/about" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group">
           About Us
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/contact" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group">
           Contact Us
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/faq" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group">
           FAQ
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
         <Link href="/ai-recommend" className="text-sm xl:text-base text-gray-700 hover:text-green-700 transition-colors py-2 relative group">
          AI Recommend
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
         </Link>
       </nav>
       
       {/* Right side profile and cart */}
       <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
         {/* Cart icon */}
         <Link 
           href={user ? "/cart" : "/login?redirectTo=/cart&message=Please login to view your cart"} 
           className="text-gray-700 hover:text-green-700 relative transition-colors p-2"
         >
           <ShoppingCart size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
           {user && cartItemCount > 0 && (
             <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-[10px] lg:text-xs" style={{backgroundColor: '#347433'}}>
               {cartItemCount > 99 ? '99+' : cartItemCount}
             </span>
           )}
         </Link>
         
         {isLoading ? (
           <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded-full animate-pulse"></div>
         ) : user ? (
           <div className="relative" ref={profileMenuRef}>
             <button 
               onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
               className="flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-green-700 focus:outline-none max-w-[120px] lg:max-w-none"
             >
               <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0" style={{border: '2px solid #347433'}}>
                 {user.profilePicture ? (
                   <img 
                     src={user.profilePicture} 
                     alt={user.name} 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <User size={16} className="lg:w-5 lg:h-5 text-gray-500" />
                 )}
               </div>
               <span className="font-medium text-sm lg:text-base hidden lg:block truncate">{user.name?.split(' ')[0]}</span>
               <ChevronDown size={14} className="lg:w-4 lg:h-4 transition-transform duration-200 hidden lg:block flex-shrink-0 ${isProfileMenuOpen ? 'rotate-180' : ''}" />
             </button>
             
             {isProfileMenuOpen && (
               <motion.div 
                 className="absolute right-0 mt-2 w-44 lg:w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100"
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
               >
                 <div className="px-3 lg:px-4 py-2 border-b border-gray-100">
                   <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">{user.name}</p>
                   <p className="text-[10px] lg:text-xs text-gray-500 truncate">{user.email}</p>
                 </div>
                 
                 <Link href="/profile" className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                   <User size={14} className="mr-2 flex-shrink-0" />
                   <span>My Profile</span>
                 </Link>
                 
                 <Link href="/dashboard" className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                   <Package size={14} className="mr-2 flex-shrink-0" />
                   <span>Dashboard</span>
                 </Link>
                 
                 <Link href="/my-materials" className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                   <Package size={14} className="mr-2 flex-shrink-0" />
                   <span>My Items</span>
                 </Link>
                 
                 <Link href="/order-history" className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                   <Package size={14} className="mr-2 flex-shrink-0" />
                   <span>Order History</span>
                 </Link>
                 
                 <button 
                   onClick={handleLogout}
                   className="flex items-center w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-red-50 hover:text-red-500"
                 >
                   <LogOut size={14} className="mr-2 flex-shrink-0" />
                   <span>Logout</span>
                 </button>
               </motion.div>
             )}
           </div>
         ) : (
           <Link href="/login" className="text-white px-3 lg:px-4 py-2 rounded-md transition-colors font-medium shadow-md hover:bg-green-800 text-sm lg:text-base" style={{backgroundColor: '#347433'}}>
             Login
           </Link>
         )}
       </div>
       
       <button 
         className="lg:hidden p-1" 
         onClick={() => setIsOpen(!isOpen)}
         aria-label={isOpen ? "Close menu" : "Open menu"}
       >
         {isOpen ? <X style={{color: '#347433'}} size={24} /> : <Menu style={{color: '#347433'}} size={24} />}
       </button>
     </div>

     <AnimatePresence>
       {isOpen && (
         <motion.div
           className="lg:hidden bg-white border-t border-gray-100"
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           transition={{ duration: 0.3 }}
         >
           <nav className="flex flex-col items-center py-4 space-y-3 px-4">
             <Link href="/" className="text-gray-700 hover:text-green-700 transition-colors text-base font-medium" onClick={closeMenu}>
               Home
             </Link>
             <Link href="/rawmaterials" className="text-gray-700 hover:text-green-700 transition-colors text-base font-medium" onClick={closeMenu}>
               Browse Items
             </Link>
             <Link href="/dashboard" className="text-gray-700 hover:text-green-700 transition-colors flex items-center text-base font-medium" onClick={closeMenu}>
               <Package size={18} className="mr-2" />
               Dashboard
             </Link>
             <Link href="/add-raw-material" className="text-gray-700 hover:text-green-700 transition-colors flex items-center text-base font-medium" onClick={closeMenu}>
               <Plus size={18} className="mr-2" />
               Sell Item
             </Link>
             <Link href="/about" className="text-gray-700 hover:text-green-700 transition-colors text-base font-medium" onClick={closeMenu}>
               About Us
             </Link>
             <Link href="/contact" className="text-gray-700 hover:text-green-700 transition-colors text-base font-medium" onClick={closeMenu}>
               Contact Us
             </Link>
             <Link href="/faq" className="text-gray-700 hover:text-green-700 transition-colors text-base font-medium" onClick={closeMenu}>
               FAQ
             </Link>
             <Link href="/ai-recommend" className="text-gray-700 hover:text-green-700 transition-colors text-base font-medium" onClick={closeMenu}>
              AI Recommendations
             </Link>
             
             {/* Cart button */}
             <Link 
               href={user ? "/cart" : "/login?redirectTo=/cart&message=Please login to view your cart"}
               onClick={closeMenu}
               className="w-full max-w-xs text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md flex items-center justify-center hover:bg-green-800 text-base"
               style={{backgroundColor: '#347433'}}
             >
               <ShoppingCart size={18} className="mr-2" />
               My Cart
               {user && cartItemCount > 0 && (
                 <span className="ml-2 bg-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{color: '#347433'}}>
                   {cartItemCount > 99 ? '99+' : cartItemCount}
                 </span>
               )}
             </Link>
             
             {isLoading ? (
               <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
             ) : user ? (
               <div className="w-full flex flex-col items-center space-y-3 border-t border-gray-100 pt-4 mt-4">
                 <div className="flex items-center space-x-3 px-4">
                   <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0" style={{border: '2px solid #347433'}}>
                     {user.profilePicture ? (
                       <img 
                         src={user.profilePicture} 
                         alt={user.name} 
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <User size={24} className="text-gray-500" />
                     )}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-gray-900 truncate text-base">{user.name}</p>
                     <p className="text-sm text-gray-500 truncate">{user.email}</p>
                   </div>
                 </div>
                 
                 <Link href="/profile" 
                   className="w-full max-w-xs text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md flex items-center justify-center hover:bg-green-800 text-base"
                   style={{backgroundColor: '#347433'}}
                   onClick={closeMenu}
                 >
                   <User size={18} className="mr-2" />
                   My Profile
                 </Link>
                 
                 <Link href="/dashboard" 
                   className="w-full max-w-xs text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md flex items-center justify-center hover:bg-green-800 text-base"
                   style={{backgroundColor: '#347433'}}
                   onClick={closeMenu}
                 >
                   <Package size={18} className="mr-2" />
                   Dashboard
                 </Link>
                 
                 <Link href="/my-materials" 
                   className="w-full max-w-xs text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md flex items-center justify-center hover:bg-green-800 text-base"
                   style={{backgroundColor: '#347433'}}
                   onClick={closeMenu}
                 >
                   <Package size={18} className="mr-2" />
                   My Items
                 </Link>
                 
                 <Link href="/order-history" 
                   className="w-full max-w-xs text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md flex items-center justify-center hover:bg-green-800 text-base"
                   style={{backgroundColor: '#347433'}}
                   onClick={closeMenu}
                 >
                   <Package size={18} className="mr-2" />
                   Order History
                 </Link>
                 
                 <button 
                   onClick={() => {
                     closeMenu();
                     handleLogout();
                   }}
                   className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md flex items-center justify-center text-base"
                 >
                   <LogOut size={18} className="mr-2" />
                   Logout
                 </button>
               </div>
             ) : (
               <div className="w-full flex flex-col items-center space-y-3 border-t border-gray-100 pt-4 mt-4">
                 <Link href="/login" 
                   className="w-full max-w-xs text-white px-4 py-3 rounded-full text-center transition-all duration-300 font-medium shadow-md hover:bg-green-800 text-base"
                   style={{backgroundColor: '#347433'}}
                   onClick={closeMenu}
                 >
                   Login
                 </Link>
                 <Link href="/register" 
                   className="w-full max-w-xs border-2 text-green-700 px-4 py-3 rounded-full text-center transition-all duration-300 font-medium hover:bg-green-50 text-base"
                   style={{borderColor: '#347433'}}
                   onClick={closeMenu}
                 >
                   Register
                 </Link>
               </div>
             )}
           </nav>
         </motion.div>
       )}
     </AnimatePresence>
   </motion.header>
 )
}