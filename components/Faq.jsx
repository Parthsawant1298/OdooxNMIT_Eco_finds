"use client";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ChevronDown, ChevronUp, Mail, MessageSquare, Phone, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HelpAndSupport() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'platform', name: 'Platform Features' },
    { id: 'sellers', name: 'For Sellers' },
    { id: 'buyers', name: 'For Buyers' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  const faqs = [
    {
      category: 'platform',
      question: "What is EcoFinds and how does it work?",
      answer: "EcoFinds is a sustainable second-hand marketplace that connects eco-conscious buyers with quality pre-owned items. Our platform promotes circular economy by giving products a second life, reducing waste, and making sustainable shopping accessible to everyone. We verify all sellers and items to ensure quality and authenticity."
    },
    {
      category: 'sellers',
      question: "How does the seller verification system work?",
      answer: "Our comprehensive seller verification system ensures trust and quality. All sellers undergo identity verification, and their items are quality-checked. We provide seller ratings, reviews, and detailed item descriptions to help buyers make informed decisions while maintaining a safe marketplace environment."
    },
    {
      category: 'sustainability',
      question: "How does EcoFinds promote sustainability?",
      answer: "EcoFinds promotes circular economy by extending product lifecycles, reducing waste, and encouraging responsible consumption. Every purchase on our platform prevents items from ending up in landfills and reduces the demand for new product manufacturing, significantly lowering environmental impact."
    },
    {
      category: 'buyers',
      question: "What is the quality assurance program?",
      answer: "Our comprehensive quality assurance ensures all items meet high standards. We have detailed item descriptions, multiple photos, condition ratings, and seller verification. Items that don't match descriptions are eligible for returns, and we maintain strict seller ratings to ensure consistent quality."
    },
    {
      category: 'platform',
      question: "What types of items can I find on EcoFinds?",
      answer: "EcoFinds offers a wide variety of pre-owned items including electronics, furniture, clothing, books, household items, sports equipment, musical instruments, and collectibles. Our platform categorizes items by condition, price range, and location for easy browsing and discovery."
    },
    {
      category: 'sellers',
      question: "How much can I earn selling on EcoFinds?",
      answer: "Sellers typically recover 40-70% of an item's original value depending on condition, demand, and category. Popular items like electronics and designer clothing often sell quickly at good prices. Our platform provides pricing suggestions based on market data to help you price competitively."
    },
    {
      category: 'platform',
      question: "How accurate are the item condition descriptions?",
      answer: "We use a standardized 5-point condition rating system (Excellent, Very Good, Good, Fair, Poor) with detailed descriptions and photo requirements. Sellers must accurately represent item condition, and buyers can report discrepancies for review and potential returns."
    },
    {
      category: 'buyers',
      question: "How do I become a verified buyer on EcoFinds?",
      answer: "Buyer verification is simple and involves email confirmation, phone number verification, and payment method validation. Verified buyers get access to exclusive deals, priority support, and enhanced buyer protection. The process takes just a few minutes to complete."
    },
    {
      category: 'platform',
      question: "Is there a minimum purchase requirement?",
      answer: "No minimum purchase requirements! EcoFinds welcomes buyers of all types, from occasional shoppers to regular bargain hunters. We offer items at all price points, from affordable everyday items to premium pre-owned luxury goods."
    },
    {
      category: 'sellers',
      question: "How does shipping work and what are the costs?",
      answer: "EcoFinds partners with reliable shipping providers for secure delivery. Shipping costs are calculated based on item size, weight, and distance. For local items, we also support in-person pickup options. Sellers can choose to include shipping in their listing price or charge separately."
    },
    {
      category: 'platform',
      question: "Do I need special equipment to use EcoFinds?",
      answer: "You only need a smartphone or computer with internet access! Our mobile app and website are user-friendly and work on any modern device. The platform includes easy photo upload, messaging systems, and secure payment processing - everything you need for seamless buying and selling."
    },
    {
      category: 'platform',
      question: "How does pricing work on the platform?",
      answer: "EcoFinds uses market-based pricing with recommendations based on similar items, condition, and demand. Sellers set their own prices but receive guidance on competitive pricing. We also feature price alerts for buyers and promotional tools for sellers to boost visibility."
    },
    {
      category: 'buyers',
      question: "What are the benefits for buyers joining EcoFinds?",
      answer: "Buyers gain access to unique, high-quality pre-owned items at affordable prices, contribute to environmental sustainability, and discover rare or vintage pieces. Our platform provides buyer protection, detailed item descriptions, secure payments, and user reviews to ensure a trusted shopping experience."
    },
    {
      category: 'sellers',
      question: "How does EcoFinds help during seasonal sales or special events?",
      answer: "Our platform features seasonal promotions, special event sales, and trending categories. We send notifications about popular items, seasonal demand, and promotional opportunities. During holidays and special events, we boost visibility for relevant items and provide marketing support."
    },
    {
      category: 'platform',
      question: "What support is available if I have issues with orders?",
      answer: "EcoFinds offers comprehensive customer support through our mobile app chat, email support, and dedicated help center. Our support team handles disputes, provides buying/selling guidance, and ensures smooth transactions. We guarantee response times within 24 hours for all inquiries."
    }
  ];

  useEffect(() => {
    const filtered = faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredFaqs(filtered);
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black text-center mb-2 md:mb-4">
              HELP AND 
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(135deg, #347433 0%, #2d5f2d 50%, #1e4a1e 100%)', WebkitBackgroundClip: 'text' }}> SUPPORT</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl">
              Everything you need to know about EcoFinds' sustainable second-hand marketplace platform
            </p>
          </div>
        </div>
      </section>

    

      {/* Search Section */}
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions about EcoFinds..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm"
                style={{ focusBorderColor: '#347433' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                style={selectedCategory === category.id ? { backgroundColor: '#347433' } : {}}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(135deg, #347433 0%, #2d5f2d 100%)', WebkitBackgroundClip: 'text' }}> Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about EcoFinds and how we promote sustainable shopping
            </p>
          </div>

          <div className="grid gap-8 max-w-3xl mx-auto">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 shadow-sm"
                style={{ '&:hover': { borderColor: 'rgba(52, 116, 51, 0.3)' } }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6" style={{color: '#347433'}} />
                  ) : (
                    <ChevronDown className="h-6 w-6" style={{color: '#347433'}} />
                  )}
                </button>
                <div
                  className={`px-6 transition-all duration-300 ${
                    openIndex === index ? 'pb-6 opacity-100' : 'h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Need More
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(135deg, #347433 0%, #2d5f2d 100%)', WebkitBackgroundClip: 'text' }}> Information?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team is here to help with your sustainable shopping journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center transition-all shadow-sm" style={{ '&:hover': { borderColor: 'rgba(52, 116, 51, 0.3)' } }}>
              <Mail className="w-12 h-12 mx-auto mb-4" style={{color: '#347433'}} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@ecofinds.ai</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center transition-all shadow-sm" style={{ '&:hover': { borderColor: 'rgba(52, 116, 51, 0.3)' } }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{color: '#347433'}} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat Support</h3>
              <p className="text-gray-600">Available 24/7 in 12 languages</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center transition-all shadow-sm" style={{ '&:hover': { borderColor: 'rgba(52, 116, 51, 0.3)' } }}>
              <Phone className="w-12 h-12 mx-auto mb-4" style={{color: '#347433'}} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">Talk to our AI specialists</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}