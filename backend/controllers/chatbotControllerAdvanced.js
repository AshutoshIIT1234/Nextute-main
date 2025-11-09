// Advanced RAG Chatbot Controller with OpenAI Integration
import OpenAI from 'openai';
import prisma from '../db/index.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory vector store
let knowledgeBase = [];

// Initialize knowledge base with website content
const initializeKnowledgeBase = async () => {
  try {
    knowledgeBase = [];

    // Fetch institutes data
    const institutes = await prisma.institute.findMany({
      select: {
        name: true,
        description: true,
        address: true,
        city: true,
        courses: true,
        fees: true,
        rating: true
      }
    });

    // Add institute information
    institutes.forEach(institute => {
      knowledgeBase.push({
        type: 'institute',
        content: `${institute.name} is a coaching institute located in ${institute.city}, ${institute.address}. ${institute.description || ''} They offer courses in: ${institute.courses?.join(', ') || 'various subjects'}. Fee structure: ${institute.fees || 'Contact for details'}. Student rating: ${institute.rating || 'Not rated yet'}/5`,
        metadata: { ...institute, category: 'institute' }
      });
    });

    // Add comprehensive FAQs and website information
    const websiteInfo = [
      {
        type: 'about',
        content: 'Nextute is a comprehensive educational platform that connects students with the best coaching institutes and mentorship programs across India. We help students make informed decisions about their education by providing detailed information, reviews, and comparisons of coaching centers.',
        metadata: { category: 'about', priority: 'high' }
      },
      {
        type: 'services',
        content: 'Nextute offers multiple services: 1) Institute Discovery - Find and compare coaching institutes by location, courses, fees, and ratings. 2) Mentorship Programs - Connect with IIT and NEET toppers for personalized guidance. 3) Student Reviews - Read authentic reviews from students. 4) Institute Comparison - Compare multiple institutes side by side.',
        metadata: { category: 'services', priority: 'high' }
      },
      {
        type: 'mentorship',
        content: 'Our mentorship program connects students with experienced mentors who are IIT and NEET toppers. Early Bird Offer: Pro Plan ₹1,000 (originally ₹1,500) includes 2-hour session, exam strategy, expected PYQs, study techniques, and live Q&A. Premium Plan ₹1,499 (originally ₹1,999) includes 2-hour personalized session, custom study planner, monthly targets, expected PYQs with solutions, and performance analysis.',
        metadata: { category: 'mentorship', priority: 'high' }
      },
      {
        type: 'registration',
        content: 'Students can register by clicking Sign Up, filling in their details including name, email, phone, and educational background. After registration, you can browse institutes, save favorites, write reviews, and book mentorship sessions. Registration is free for students.',
        metadata: { category: 'registration', priority: 'medium' }
      },
      {
        type: 'institute_registration',
        content: 'Coaching institutes can register on Nextute to reach more students. The registration process includes: basic information, contact details, courses offered, faculty information, facilities, achievements, and media gallery. Registered institutes get a dedicated profile page and access to student feedback dashboard.',
        metadata: { category: 'institute', priority: 'medium' }
      },
      {
        type: 'search',
        content: 'You can search for coaching institutes using multiple filters: location/city, course type (JEE, NEET, UPSC, etc.), fee range, ratings, and facilities. Use the "Find Coaching" feature on the homepage or navigate to Institutes on Location page.',
        metadata: { category: 'search', priority: 'high' }
      },
      {
        type: 'comparison',
        content: 'The Institute Comparison feature allows you to compare up to 3 institutes side by side. You can compare fees, courses, facilities, faculty, ratings, and student reviews. This helps you make an informed decision about which institute suits your needs best.',
        metadata: { category: 'comparison', priority: 'medium' }
      },
      {
        type: 'reviews',
        content: 'Students can write reviews for institutes they have attended. Reviews help other students make informed decisions. You need to be logged in as a student to write a review. Reviews include ratings for teaching quality, infrastructure, study material, and overall experience.',
        metadata: { category: 'reviews', priority: 'medium' }
      },
      {
        type: 'contact',
        content: 'You can contact Nextute at: Email: contact@nextute.com, Office: Nextute EdTech Pvt. Ltd., Patna, Bihar. Follow us on Instagram (@nextute_edtech) and LinkedIn (Nextute). For institute-specific support, visit the Support page.',
        metadata: { category: 'contact', priority: 'low' }
      }
    ];

    knowledgeBase.push(...websiteInfo);

    console.log(`✅ Knowledge base initialized with ${knowledgeBase.length} entries`);
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
  }
};

// Generate embeddings using OpenAI
const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding error:', error);
    return null;
  }
};

// Cosine similarity
const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Simple keyword-based search (fallback)
const keywordSearch = (query, topK = 3) => {
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const scored = knowledgeBase.map(item => {
    const contentWords = item.content.toLowerCase().split(/\s+/);
    const overlap = queryWords.filter(word => contentWords.some(cw => cw.includes(word) || word.includes(cw))).length;
    const priorityBoost = item.metadata.priority === 'high' ? 1.5 : item.metadata.priority === 'medium' ? 1.2 : 1;
    const score = (overlap / queryWords.length) * priorityBoost;
    return { ...item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0);
};

// Semantic search using embeddings
const semanticSearch = async (query, topK = 3) => {
  try {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) return keywordSearch(query, topK);

    // Generate embeddings for knowledge base items (cache these in production)
    const scoredItems = await Promise.all(
      knowledgeBase.map(async (item) => {
        const itemEmbedding = await generateEmbedding(item.content);
        if (!itemEmbedding) return { ...item, score: 0 };
        
        const similarity = cosineSimilarity(queryEmbedding, itemEmbedding);
        return { ...item, score: similarity };
      })
    );

    return scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(item => item.score > 0.5);
  } catch (error) {
    console.error('Semantic search error:', error);
    return keywordSearch(query, topK);
  }
};

// Generate response using OpenAI with RAG
const generateRAGResponse = async (query, context, conversationHistory = []) => {
  try {
    const contextText = context.map(c => c.content).join('\n\n');
    
    const systemPrompt = `You are a helpful assistant for Nextute, an educational platform that helps students find coaching institutes and mentorship programs. 

Use the following context to answer questions accurately and helpfully:

${contextText}

Guidelines:
- Be friendly, professional, and concise
- If the context doesn't contain the answer, politely say so and suggest what you can help with
- Provide specific details from the context when available
- For institute queries, mention names, locations, and key details
- For mentorship queries, explain the plans and pricing
- Always encourage users to explore the platform features`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // Last 3 exchanges
      { role: 'user', content: query }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback response
    if (context.length > 0) {
      return `Based on our records:\n\n${context[0].content}\n\nWould you like to know more about this or explore other options?`;
    }
    return "I'm here to help you find coaching institutes and mentorship programs. You can ask me about:\n- Finding institutes by location or course\n- Mentorship programs and pricing\n- How to register as a student or institute\n- Comparing institutes\n- Writing reviews\n\nWhat would you like to know?";
  }
};

// Main query handler
export const handleChatQuery = async (req, res) => {
  try {
    const { query, conversationHistory = [], useSemanticSearch = false } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Search knowledge base
    const relevantContext = useSemanticSearch && process.env.OPENAI_API_KEY
      ? await semanticSearch(query)
      : keywordSearch(query);

    // Generate response
    const answer = await generateRAGResponse(query, relevantContext, conversationHistory);

    res.json({
      answer,
      sources: relevantContext.map(c => ({
        type: c.type,
        category: c.metadata.category
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat query error:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      answer: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact support at contact@nextute.com"
    });
  }
};

// Refresh knowledge base
export const refreshKnowledgeBase = async (req, res) => {
  try {
    await initializeKnowledgeBase();
    res.json({ 
      message: 'Knowledge base refreshed successfully', 
      entries: knowledgeBase.length 
    });
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
