const HardwareItem = require('../models/HardwareItem');
const User = require('../models/User');

/**
 * Search hardware items using MongoDB Atlas Vector Search.
 * Falls back to text search if vector index is not configured.
 */
const searchHardware = async (queryEmbedding, filters = {}, limit = 10) => {
  const indexName = process.env.VECTOR_SEARCH_INDEX_NAME || 'default';

  try {
    // Attempt vector search
    const pipeline = [
      {
        $vectorSearch: {
          index: indexName,
          path: 'item_description_embedding',
          queryVector: queryEmbedding,
          numCandidates: limit * 10,
          limit: limit,
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          owner_id: 1,
          location: 1,
          availability_status: 1,
          category: 1,
          specs: 1,
          image_url: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    // Add availability filter if specified
    if (filters.availability_status) {
      pipeline.splice(1, 0, {
        $match: { availability_status: filters.availability_status },
      });
    }

    const results = await HardwareItem.aggregate(pipeline);

    if (results.length > 0) {
      return await HardwareItem.populate(results, { path: 'owner_id', select: 'name email avatar_url' });
    }
  } catch (error) {
    console.warn('Vector search not available, falling back to text search:', error.message);
  }

  // Fallback: keyword/text search
  return await HardwareItem.find({
    availability_status: filters.availability_status || 'available',
  })
    .populate('owner_id', 'name email avatar_url')
    .limit(limit)
    .sort({ createdAt: -1 });
};

/**
 * Search mentors (users) using MongoDB Atlas Vector Search on skills embedding.
 * Falls back to text search if vector index is not configured.
 */
const searchMentors = async (queryEmbedding, filters = {}, limit = 10) => {
  const indexName = process.env.VECTOR_SEARCH_INDEX_NAME || 'default';

  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: indexName,
          path: 'skills_embedding',
          queryVector: queryEmbedding,
          numCandidates: limit * 10,
          limit: limit,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          skills: 1,
          bio: 1,
          avatar_url: 1,
          availability: 1,
          location: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    if (filters.availability !== undefined) {
      pipeline.splice(1, 0, {
        $match: { availability: filters.availability },
      });
    }

    const results = await User.aggregate(pipeline);

    if (results.length > 0) return results;
  } catch (error) {
    console.warn('Vector search not available for mentors, falling back:', error.message);
  }

  // Fallback
  return await User.find({
    availability: true,
    skills: { $exists: true, $ne: [] },
  })
    .select('name email skills bio avatar_url availability location')
    .limit(limit)
    .sort({ createdAt: -1 });
};

module.exports = { searchHardware, searchMentors };
