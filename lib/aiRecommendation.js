// lib/aiRecommendation.js - Simple AI Recommendation Logic
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini 2.0 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export class AIRecommendationEngine {
  
  // Simple extraction - just split input into words
  static async extractRawMaterialNames(userInput) {
    try {
      // Simple word extraction without AI
      const words = userInput.toLowerCase()
        .split(/[,\s]+/)
        .filter(word => word.length > 2)
        .map(word => word.trim());
      
      return words.length > 0 ? words : [userInput.toLowerCase().trim()];
    } catch (error) {
      console.error('Extraction error:', error);
      return [userInput.toLowerCase().trim()];
    }
  }

  // Simple exact name matching in database
  static async findMatchingMaterials(materialNames, allRawMaterials) {
    const matches = [];
    
    for (const materialName of materialNames) {
      const searchTerm = materialName.toLowerCase().trim();
      
      const foundMaterials = allRawMaterials.filter(material => {
        const materialName = material.name.toLowerCase();
        
        // Exact name matching only
        return materialName.includes(searchTerm) || searchTerm.includes(materialName);
      });
      
      if (foundMaterials.length > 0) {
        matches.push({
          searchTerm: materialName,
          materials: foundMaterials
        });
      }
    }
    
    return matches;
  }

  // Calculate distance between two locations (simple approximation)
  static calculateDistance(userCity, sellerCity) {
    if (!userCity || !sellerCity) return 1000; // Default high distance
    
    const userLower = userCity.toLowerCase();
    const sellerLower = sellerCity.toLowerCase();
    
    // Same city/area check
    if (userLower.includes(sellerLower) || sellerLower.includes(userLower)) {
      return 10; // Same city
    }
    
    // Simple state/region matching
    const userWords = userLower.split(/[\s,]+/);
    const sellerWords = sellerLower.split(/[\s,]+/);
    
    for (const userWord of userWords) {
      for (const sellerWord of sellerWords) {
        if (userWord === sellerWord && userWord.length > 3) {
          return 50; // Same region/state
        }
      }
    }
    
    // Different regions
    return 200;
  }

  // Simple comparison and ranking - just by price and rating
  static rankSellers(materials, userLocation) {
    return materials.map(material => {
      let score = 0;
      
      // Rating score (0-50 points)
      score += (material.ratings || 0) * 10;
      
      // Review count score (0-20 points) 
      score += Math.min((material.numReviews || 0) * 2, 20);
      
      // Price score (lower price = higher score, 0-30 points)
      const maxPrice = Math.max(...materials.map(m => m.price), 100);
      score += (maxPrice - material.price) / maxPrice * 30;
      
      return {
        ...material,
        aiScore: Math.round(score * 100) / 100,
        distance: 0, // No location calculation
        reasonForRecommendation: this.generateSimpleReason(material)
      };
    }).sort((a, b) => b.aiScore - a.aiScore);
  }

  // Simple reason generation
  static generateSimpleReason(material) {
    const reasons = [];
    
    if (material.ratings >= 4) reasons.push('Highly rated');
    if (material.discount > 10) reasons.push(`${material.discount}% discount`);
    if (material.numReviews > 5) reasons.push('Well reviewed');
    if (material.quantity > 50) reasons.push('Good stock');
    if (material.price < 1000) reasons.push('Affordable price');
    
    return reasons.length > 0 ? reasons.join(', ') : 'Available item';
  }

  // Simple recommendation function - exact matching only
  static async getRecommendations(userInput, userLocation, allRawMaterials) {
    try {
      // Step 1: Simple word extraction
      const materialNames = await this.extractRawMaterialNames(userInput);
      console.log('Search terms:', materialNames);
      
      // Step 2: Find exact matches in database
      const matches = await this.findMatchingMaterials(materialNames, allRawMaterials);
      console.log('Exact matches found:', matches.length);
      
      // Step 3: Simple ranking by price and rating
      const recommendations = [];
      
      for (const match of matches) {
        const rankedMaterials = this.rankSellers(match.materials, userLocation);
        
        if (rankedMaterials.length > 0) {
          recommendations.push({
            searchTerm: match.searchTerm,
            recommendedMaterial: rankedMaterials[0], // Best match
            alternatives: rankedMaterials.slice(1, 2) // Top 1 alternative
          });
        }
      }
      
      return {
        success: true,
        recommendations,
        totalFound: recommendations.length
      };
      
    } catch (error) {
      console.error('Simple recommendation error:', error);
      return {
        success: false,
        error: error.message,
        recommendations: []
      };
    }
  }
}