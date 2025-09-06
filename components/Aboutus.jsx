'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Testimonial from '@/components/Testimonial'
import { Clock, Coffee, HeartHandshake, Package, Shield, ShoppingBag, Truck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AboutusPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: "2024", label: "Founded", icon: <ShoppingBag className="h-6 w-6" /> },
    { number: "25,000+", label: "Happy Users", icon: <Users className="h-6 w-6" /> },
    { number: "48", label: "Hour Response Time", icon: <Clock className="h-6 w-6" /> },
    { number: "50,000+", label: "Items Sold", icon: <Package className="h-6 w-6" /> }
  ]

  const values = [
    {
      icon: <Truck className="h-12 w-12" />,
      title: "Quality Assurance",
      description: "Every item is carefully inspected and verified for quality before listing. We ensure you get authentic, well-maintained pre-owned products that exceed expectations."
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Secure Transactions",
      description: "Advanced security measures protect every transaction. Our platform ensures safe payments, buyer protection, and seller verification for complete peace of mind."
    },
    {
      icon: <HeartHandshake className="h-12 w-12" />,
      title: "Community Impact",
      description: "Every purchase supports the circular economy, reduces waste, and promotes sustainable consumption. Join a community that values environmental responsibility and conscious living."
    }
  ]

  const categories = [
    {
      id: 'electronics',
      title: 'ELECTRONICS',
      label: 'EXPLORE',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      route: '/category/electronics'
    },
    {
      id: 'furniture',
      title: 'FURNITURE',
      label: 'EXPLORE',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      route: '/category/furniture'
    },
    {
      id: 'clothing',
      title: 'CLOTHING',
      label: 'EXPLORE',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      route: '/category/clothing'
    },
    {
      id: 'books',
      title: 'BOOKS',
      label: 'FEATURED',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      route: '/category/books'
    },
    {
      id: 'household',
      title: 'HOUSEHOLD ITEMS',
      label: 'FEATURED',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      route: '/category/household'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[35rem] overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full" style={{ backgroundColor: '#347433' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full" style={{ backgroundColor: '#FFC107' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full" style={{ backgroundColor: '#FF6F3C' }}></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 rounded-full" style={{ backgroundColor: '#B22222' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 h-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black text-center mb-2 md:mb-4">
              ABOUT
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(135deg, #347433 0%, #2d5f2d 50%, #1e4a1e 100%)', WebkitBackgroundClip: 'text' }}> EcoFinds</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl">
              Empowering Sustainable Consumption Through a Trusted Second-Hand Marketplace
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden h-96">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                  alt="EcoFinds Second-Hand Marketplace"
                  className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-6">
              <span className="font-semibold tracking-wider uppercase" style={{color: '#347433'}}>Who We Are</span>
              <h2 className="text-4xl font-bold text-gray-900">
                Revolutionizing Second-Hand Commerce for a Sustainable Future
              </h2>
              <p className="text-gray-600 text-lg">
                EcoFinds is a vibrant and trusted platform revolutionizing the way people buy and sell pre-owned goods. We're fostering a culture of sustainability by extending the lifecycle of products, reducing waste, and providing an accessible alternative to purchasing new items.
              </p>
              <p className="text-gray-600 text-lg">
                Our mission is to create the go-to destination for a conscious community seeking unique finds and responsible consumption. We leverage intuitive design and essential features to connect buyers and sellers efficiently, promoting a circular economy that benefits everyone.
              </p>
              <div className="flex gap-4 pt-4">
                <Coffee style={{color: '#347433'}} className="h-6 w-6" />
                <div>
                  <h3 className="text-gray-900 font-semibold">Our Mission</h3>
                  <p className="text-gray-600">To make sustainable choices easier for everyone by creating a trusted marketplace where pre-owned goods find new homes, reducing environmental impact while building a community of conscious consumers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{ backgroundColor: '#f0f9f0' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="mb-4" style={{color: '#347433'}}>{stat.icon}</div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Our Platform Features
            </h2>
            <p className="text-xl text-gray-600 mx-auto max-w-2xl">
              Essential features that make buying and selling second-hand items safe, easy, and enjoyable
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div id="quality-assurance" className="bg-white rounded-xl p-8 shadow-lg">
              <Package style={{color: '#347433'}} className="h-12 w-12 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">QUALITY VERIFICATION</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Item authenticity checks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Condition verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Photo validation system
                </li>
              </ul>
            </div>
            
            <div id="secure-transactions" className="bg-white rounded-xl p-8 shadow-lg">
              <Package style={{color: '#347433'}} className="h-12 w-12 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SECURE MARKETPLACE</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Buyer protection program
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Secure payment gateway
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  User verification system
                </li>
              </ul>
            </div>
            
            <div id="easy-browsing" className="bg-white rounded-xl p-8 shadow-lg">
              <Package style={{color: '#347433'}} className="h-12 w-12 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SMART DISCOVERY</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Advanced search filters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Category browsing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Personalized recommendations
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div id="community" className="bg-white rounded-xl p-8 shadow-lg">
              <Package style={{color: '#347433'}} className="h-12 w-12 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">COMMUNITY FOCUSED</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  User reviews & ratings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Sustainability tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Environmental impact metrics
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <Package style={{color: '#347433'}} className="h-12 w-12 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">EASY LISTING</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Simple upload process
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Automatic price suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#347433'}}></span>
                  Quick item management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0f9f0 100%)' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 mx-auto max-w-2xl">
              Building a sustainable future through responsible consumption and community engagement
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="mb-6" style={{color: '#347433'}}>{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-semibold tracking-wider uppercase px-4 py-2 rounded-full" style={{color: '#347433', backgroundColor: '#f0f9f0'}}>Environmental Impact</span>
            <h2 className="text-5xl font-bold mt-6 mb-6 text-gray-900">
              Our <span style={{color: '#347433'}}>Sustainability</span> Impact
            </h2>
            <p className="text-xl text-gray-600 mx-auto max-w-2xl">
              Creating positive environmental change through conscious consumption and the circular economy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 p-8 rounded-xl shadow-lg h-full" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)' }}>
              <h3 className="text-2xl font-bold text-gray-900">Making Every Purchase Count</h3>
              <p className="text-gray-600 text-lg mb-8">
                EcoFinds is transforming how people think about consumption, making sustainable choices accessible and rewarding:
              </p>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#f0f9f0'}}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{backgroundColor: '#347433'}}>1</span>
                  </div>
                  <div>
                    <h4 className="font-bold" style={{color: '#347433'}}>25,000+ Happy Users</h4>
                    <p className="text-gray-600">A growing community of conscious consumers making sustainable choices every day</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#f0f9f0'}}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{backgroundColor: '#347433'}}>2</span>
                  </div>
                  <div>
                    <h4 className="font-bold" style={{color: '#347433'}}>85% Waste Reduction</h4>
                    <p className="text-gray-600">Every item sold extends product lifecycles and keeps valuable items out of landfills</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#f0f9f0'}}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{backgroundColor: '#347433'}}>3</span>
                  </div>
                  <div>
                    <h4 className="font-bold" style={{color: '#347433'}}>Circular Economy Champion</h4>
                    <p className="text-gray-600">Creating a marketplace where items get multiple lives and stories, reducing environmental impact</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#f0f9f0'}}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{backgroundColor: '#347433'}}>4</span>
                  </div>
                  <div>
                    <h4 className="font-bold" style={{color: '#347433'}}>Quality & Trust Focus</h4>
                    <p className="text-gray-600">Every item is verified for quality, ensuring buyers get authentic, well-maintained products</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#f0f9f0'}}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{backgroundColor: '#347433'}}>5</span>
                  </div>
                  <div>
                    <h4 className="font-bold" style={{color: '#347433'}}>Community-Driven Platform</h4>
                    <p className="text-gray-600">Building connections between conscious consumers who value sustainability and unique finds</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-full">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full z-0" style={{backgroundColor: '#f0f9f0'}}></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full z-0" style={{backgroundColor: '#f0f9f0'}}></div>
              <div className="relative h-full rounded-xl overflow-hidden z-10 shadow-xl" style={{ minHeight: '550px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="EcoFinds Sustainable Impact"
                  className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-700"
                  style={{ height: '100%', objectPosition: 'center' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(52, 116, 51, 0.3) 0%, transparent 100%)' }}></div>
                <div className="absolute bottom-4 left-4 right-4 text-center bg-white/90 p-4 rounded-lg shadow-lg">
                  <p className="font-semibold" style={{color: '#347433'}}>Empowering sustainable consumption through trusted second-hand marketplace since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     
      <Testimonial />
      <Footer />
    </main>
  )
}