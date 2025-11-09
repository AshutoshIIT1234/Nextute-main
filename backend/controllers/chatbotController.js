import axios from 'axios';
import prisma from '../db/index.js';

// In-memory vector store (for production, use Pinecone, Weaviate, or PostgreSQL with pgvector)
let knowledgeBase = [];

// Initialize knowledge base with website content
const initializeKnowledgeBase = async () => {
  try {
    // Try to fetch institutes data
    try {
      const institutes = await prisma.institute.findMany({
        select: {
          id: true,
          institute_name: true,
          basic_info: true,
          contact_details: true,
          facilities: true
        }
      });

      // Add institute information to knowledge base
      institutes.forEach(institute => {
        const basicInfo = institute.basic_info || {};
        const contactDetails = institute.contact_details || {};
        
        const name = institute.institute_name || 'Institute';
        const description = basicInfo.description || '';
        const city = contactDetails.city || '';
        const address = contactDetails.address || '';
        const courses = basicInfo.courses || [];
        
        knowledgeBase.push({
          type: 'institute',
          content: `${name} is a coaching institute${city ? ` located in ${city}` : ''}${address ? `, ${address}` : ''}. ${description} ${courses.length > 0 ? `They offer courses in: ${courses.join(', ')}.` : ''} Contact them for detailed fee structure and admission information.`,
          keywords: [name.toLowerCase(), city.toLowerCase(), ...courses.map(c => c.toLowerCase())],
          metadata: { 
            id: institute.id,
            name,
            city,
            category: 'institute',
            priority: 'medium'
          }
        });
      });
      
      console.log(`✅ Loaded ${institutes.length} institutes from database`);
    } catch (dbError) {
      console.warn('⚠️  Database not available, using FAQ-only mode:', dbError.message);
    }

    // Add comprehensive FAQs and information
    const faqs = [
      // About Nextute
      {
        type: 'faq',
        content: 'Nextute is an educational platform that helps students find the best coaching institutes and mentorship programs. We connect students with top coaching centers and experienced mentors across India. Our platform provides detailed information, reviews, and comparisons to help students make informed decisions about their education.',
        keywords: ['nextute', 'about', 'what', 'platform', 'education', 'edtech', 'who', 'company'],
        metadata: { category: 'about', priority: 'high' }
      },
      // Services
      {
        type: 'faq',
        content: 'Nextute offers multiple services: 1) Institute Discovery - Find and compare coaching institutes by location, courses, fees, and ratings. 2) Mentorship Programs - Connect with IIT and NEET toppers for personalized guidance. 3) Student Reviews - Read authentic reviews from students. 4) Institute Comparison - Compare multiple institutes side by side. 5) Student Feedback Dashboard for institutes.',
        keywords: ['services', 'features', 'what', 'offer', 'provide', 'do', 'help', 'can'],
        metadata: { category: 'services', priority: 'high' }
      },
      // Finding Institutes
      {
        type: 'faq',
        content: 'To find coaching institutes: 1) Use the search bar on homepage. 2) Click "Find Coaching" in navigation. 3) Filter by location, course type (JEE, NEET, UPSC, etc.), fees, and ratings. 4) Browse institute profiles with detailed information. 5) Read student reviews and ratings. 6) Compare multiple institutes. You can search by city, course, or institute name.',
        keywords: ['find', 'search', 'coaching', 'institute', 'center', 'academy', 'how', 'locate', 'discover', 'browse'],
        metadata: { category: 'search', priority: 'high' }
      },
      // Mentorship Programs
      {
        type: 'faq',
        content: 'Our mentorship program connects students with IIT and NEET toppers. We offer two plans with Early Bird pricing: Pro Plan - ₹1,000 (originally ₹1,500) - 2 hour session, exam strategy, expected PYQs, study techniques, live Q&A. Premium Plan - ₹1,499 (originally ₹1,999) - 2 hour personalized session, custom study planner, monthly targets, expected PYQs with solutions, performance analysis. Mentors are experienced IIT/AIIMS students.',
        keywords: ['mentorship', 'mentor', 'guidance', 'tutor', 'coaching', 'personal', 'one-on-one', 'price', 'cost', 'fees', 'plan', 'premium', 'pro'],
        metadata: { category: 'mentorship', priority: 'high' }
      },
      // Student Registration
      {
        type: 'faq',
        content: 'To register as a student: 1) Click "Sign Up" button in navigation. 2) Fill in your details (name, email, phone, educational background). 3) Verify your email. 4) Complete your profile. After registration, you can browse institutes, save favorites, write reviews, book mentorship sessions, and get personalized recommendations. Registration is completely free for students.',
        keywords: ['register', 'signup', 'sign up', 'account', 'student', 'join', 'create', 'how', 'enroll'],
        metadata: { category: 'registration', priority: 'high' }
      },
      // Institute Registration
      {
        type: 'faq',
        content: 'Coaching institutes can register to reach more students. Registration process: 1) Click "Institute Registration". 2) Provide basic information (name, address, contact). 3) Add course details and fees. 4) Upload faculty information. 5) Add facilities and achievements. 6) Upload photos and videos. Benefits: Dedicated profile page, student feedback dashboard, increased visibility, direct student inquiries.',
        keywords: ['institute', 'coaching', 'center', 'register', 'signup', 'list', 'add', 'business', 'owner'],
        metadata: { category: 'institute', priority: 'medium' }
      },
      // Comparison
      {
        type: 'faq',
        content: 'Institute Comparison feature lets you compare up to 3 institutes side by side. Compare: fees, courses offered, faculty qualifications, facilities, student ratings, achievements, location, batch sizes. To compare: 1) Go to "Compare Institutes". 2) Select institutes. 3) View detailed comparison table. This helps you make informed decisions.',
        keywords: ['compare', 'comparison', 'versus', 'vs', 'difference', 'between', 'which', 'better'],
        metadata: { category: 'comparison', priority: 'medium' }
      },
      // Reviews
      {
        type: 'faq',
        content: 'Students can write reviews for institutes they attended. To write a review: 1) Login as student. 2) Go to "Write Review". 3) Select institute. 4) Rate teaching quality, infrastructure, study material, overall experience. 5) Write detailed feedback. Reviews help other students make informed decisions. All reviews are verified.',
        keywords: ['review', 'rating', 'feedback', 'testimonial', 'opinion', 'write', 'rate'],
        metadata: { category: 'reviews', priority: 'medium' }
      },
      // Courses
      {
        type: 'faq',
        content: 'We list coaching institutes for various competitive exams: JEE (Joint Entrance Examination), NEET (Medical entrance), UPSC (Civil Services), CAT (MBA entrance), Banking exams, SSC, State PSC, NDA, and more. You can filter institutes by the specific course you need.',
        keywords: ['course', 'exam', 'jee', 'neet', 'upsc', 'cat', 'banking', 'ssc', 'preparation', 'study'],
        metadata: { category: 'courses', priority: 'medium' }
      },
      // Pricing
      {
        type: 'faq',
        content: 'Nextute is free for students - browse institutes, read reviews, compare options at no cost. Mentorship Early Bird pricing: Pro Plan ₹1,000 (originally ₹1,500) for 2 hours, Premium Plan ₹1,499 (originally ₹1,999) for 2 hours with personalized benefits. Institute listing has different plans - contact us for details. Payment is secure via Razorpay.',
        keywords: ['price', 'cost', 'fees', 'charge', 'payment', 'free', 'paid', 'money', 'rupees'],
        metadata: { category: 'pricing', priority: 'high' }
      },
      // Contact
      {
        type: 'faq',
        content: 'Contact Nextute: Email: contact@nextute.com, Office: Nextute EdTech Pvt. Ltd., Patna, Bihar. Follow us on Instagram (@nextute_edtech) and LinkedIn (Nextute). For support, visit the Support page. We respond within 24 hours.',
        keywords: ['contact', 'email', 'phone', 'support', 'help', 'reach', 'address', 'location', 'office'],
        metadata: { category: 'contact', priority: 'low' }
      },
      // General Greetings
      {
        type: 'faq',
        content: 'Hello! I\'m Nextute\'s AI assistant. I can help you find coaching institutes, learn about mentorship programs, understand our services, or answer questions about registration and features. What would you like to know?',
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good', 'morning', 'afternoon', 'evening'],
        metadata: { category: 'greeting', priority: 'high' }
      }
    ];

    knowledgeBase.push(...faqs);

    console.log(`Knowledge base initialized with ${knowledgeBase.length} entries`);
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
  }
};

// Improved similarity search with keyword matching
const searchKnowledgeBase = (query, topK = 3) => {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  const scored = knowledgeBase.map(item => {
    let score = 0;
    
    // Check keyword matches (high weight)
    if (item.keywords) {
      const keywordMatches = item.keywords.filter(keyword => 
        queryLower.includes(keyword) || keyword.includes(queryLower)
      ).length;
      score += keywordMatches * 3;
    }
    
    // Check content word overlap
    const contentWords = item.content.toLowerCase().split(/\s+/);
    const wordMatches = queryWords.filter(word => 
      contentWords.some(cw => cw.includes(word) || word.includes(cw))
    ).length;
    score += wordMatches;
    
    // Priority boost
    if (item.metadata?.priority === 'high') score *= 1.5;
    if (item.metadata?.priority === 'medium') score *= 1.2;
    
    // Normalize score
    score = score / Math.max(queryWords.length, 1);
    
    return { ...item, score };
  });

  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0.3);
  
  // If no good matches, return high-priority items
  if (results.length === 0) {
    return knowledgeBase
      .filter(item => item.metadata?.priority === 'high')
      .slice(0, 2);
  }
  
  return results;
};

// Generate response using RAG
const generateResponse = async (query, context) => {
  if (context.length === 0) {
    return "I'm here to help! I can assist you with:\n\n• Finding coaching institutes\n• Learning about mentorship programs\n• Understanding our services\n• Registration process\n• Comparing institutes\n• Pricing information\n\nWhat would you like to know?";
  }

  // Use the most relevant context
  const primaryContext = context[0];
  
  // For greetings, return direct response
  if (primaryContext.metadata?.category === 'greeting') {
    return primaryContext.content;
  }
  
  // For specific queries, provide detailed answer
  let response = primaryContext.content;
  
  // Add related information if available
  if (context.length > 1) {
    response += "\n\n📌 Related information:\n" + context.slice(1, 2).map(c => 
      "• " + c.content.split('.')[0] + "."
    ).join('\n');
  }
  
  response += "\n\nWould you like to know more about anything specific?";
  
  return response;
};

// Main query handler
export const handleChatQuery = async (req, res) => {
  try {
    const { query, conversationHistory = [] } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Search knowledge base
    const relevantContext = searchKnowledgeBase(query);

    // Generate response
    const answer = await generateResponse(query, relevantContext);

    // Log conversation (optional)
    // await prisma.chatLog.create({
    //   data: { query, answer, context: relevantContext }
    // });

    res.json({
      answer,
      sources: relevantContext.map(c => c.metadata),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat query error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
};

// Refresh knowledge base
export const refreshKnowledgeBase = async (req, res) => {
  try {
    knowledgeBase = [];
    await initializeKnowledgeBase();
    res.json({ message: 'Knowledge base refreshed successfully', entries: knowledgeBase.length });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh knowledge base' });
  }
};

// Initialize on module load
initializeKnowledgeBase();

export default {
  handleChatQuery,
  refreshKnowledgeBase
};
