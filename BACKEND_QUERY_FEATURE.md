# Backend Feature Implementation: Natural Language Query for Students

This document contains the generated code for the requested Natural Language Query feature.

## 1. Helper Function: Keyword Extractor

This helper function extracts the interest keyword from the natural language query. It looks for phrases like "interested in [keyword]" or simply identifies common interest terms if the phrase is structured differently.

```javascript
/**
 * Extracts the interest keyword from a natural language query string.
 * @param {string} queryText - The input query from the user.
 * @returns {string|null} - The extracted interest keyword or null if not found.
 */
const extractInterestKeyword = (queryText) => {
  if (!queryText || typeof queryText !== 'string') return null;

  // Normalize text to lowercase
  const normalizedText = queryText.toLowerCase();

  // Pattern to find "interested in <keyword>"
  // This regex matches "interested in " followed by a word or phrase until punctuation or common stop words
  const interestPattern = /interested\s+in\s+([a-z0-9\s]+)/i;
  
  const match = normalizedText.match(interestPattern);

  if (match && match[1]) {
    // Clean up the match: remove "students", "who", "are", etc. if they accidentally got caught 
    // (though the regex 'interested in' usually precedes the target)
    // We strictly take the words after "interested in".
    // For this simple logic, we strip common trailing words if user typed "interested in drawing and coding"
    // We will extract the *first* interest if multiple are present or the whole phrase if it looks like a single complex interest.
    
    let rawInterest = match[1].trim();
    
    // Split by common separators (comma, ' and ', ' or ') to get the first term
    // Example: "drawing, coding" -> "drawing"
    const separators = /[,;]|\s+and\s+|\s+or\s+/;
    const firstInterest = rawInterest.split(separators)[0].trim();
    
    return firstInterest;
  }

  // Fallback: Check for single keywords if "interested in" phrase is missing
  // (In a real app, you might match against a database of interests)
  return null; 
};

module.exports = { extractInterestKeyword };
```

## 2. Express Route Definition

This code snippet belongs in your Express `routes` file (e.g., `studentRoutes.js` or `index.js`).

```javascript
const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust path to your Student model
const { extractInterestKeyword } = require('../utils/queryHelper'); // Adjust path to helper

/**
 * @route   POST /api/students/query
 * @desc    Natural language query to filter students by interest
 * @access  Public (or Protected, depending on requirements)
 */
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid query string in the request body.' 
      });
    }

    // 1. Extract keyword from natural language text
    const keyword = extractInterestKeyword(query);

    if (!keyword) {
      return res.status(200).json({
        success: true,
        message: 'Could not identify a specific interest in the query. Please try phrasing it like "interested in drawing".',
        data: []
      });
    }

    // 2. Perform case-insensitive search on 'interest' field
    // We use a regex for flexibility (partial matches)
    const students = await Student.find({
      interest: { $regex: keyword, $options: 'i' }
    });

    // 3. Return JSON response
    return res.status(200).json({
      success: true,
      count: students.length,
      extractedKeyword: keyword,
      data: students
    });

  } catch (error) {
    console.error('Error processing query:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error processing your query.' 
    });
  }
});

module.exports = router;
```

## 3. Mongoose Query Explanation

The key part of the MongoDB integration uses `$regex` for pattern matching:

```javascript
// 'interest' is the field name in the MongoDB Student collection
// $regex value is the extracted keyword (e.g., "drawing")
// $options: 'i' makes the search case-insensitive (matches "Drawing", "DRAWING", "drawing")
Student.find({
  interest: { $regex: keyword, $options: 'i' }
})
```

## 4. Unit Tests (Jest + Supertest)

Save this as `tests/query.test.js`.

```javascript
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const studentRoutes = require('../routes/studentRoutes'); // Adjust path
const Student = require('../models/Student'); // Adjust path

// Setup separate app for testing
const app = express();
app.use(express.json());
app.use('/api/students', studentRoutes);

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear database and add sample data before each test
  await Student.deleteMany({});
  await Student.create([
    { name: 'Alice', interest: 'Drawing' },
    { name: 'Bob', interest: 'Coding' },
    { name: 'Charlie', interest: 'Cycling' },
    { name: 'David', interest: 'drawing and painting' }
  ]);
});

describe('POST /api/students/query', () => {
  
  it('should return students matching the interest "drawing"', async () => {
    const res = await request(app)
      .post('/api/students/query')
      .send({ query: 'Show me students interested in drawing' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.extractedKeyword).toBe('drawing');
    expect(res.body.data.length).toBe(2); // Alice and David
    expect(res.body.data[0].name).toMatch(/Alice|David/);
  });

  it('should return students matching "coding" case-insensitively', async () => {
    const res = await request(app)
      .post('/api/students/query')
      .send({ query: 'Who is interested in CODING?' });

    expect(res.status).toBe(200);
    expect(res.body.extractedKeyword).toBe('coding');
    expect(res.body.data.length).toBe(1); // Bob
    expect(res.body.data[0].name).toBe('Bob');
  });

  it('should return empty list if interest not found in DB', async () => {
    const res = await request(app)
      .post('/api/students/query')
      .send({ query: 'Find students interested in skydiving' });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('should return 400 if query body is missing', async () => {
    const res = await request(app)
      .post('/api/students/query')
      .send({});

    expect(res.status).toBe(400);
  });

  it('should handle queries where keyword cannot be extracted', async () => {
    const res = await request(app)
      .post('/api/students/query')
      .send({ query: 'Hello world' });

    expect(res.status).toBe(200);
    // Depending on logic, it might return empty or specific message
    // Our logic defined returns a message saying extraction failed
    expect(res.body.message).toContain('Could not identify');
  });
});
```

## 5. Example Requests and Responses

### Request 1
**Method:** `POST`  
**URL:** `/api/students/query`  
**Body:**
```json
{
  "query": "I am looking for details of students interested in Drawing"
}
```

### Response 1
```json
{
  "success": true,
  "count": 2,
  "extractedKeyword": "drawing",
  "data": [
    {
      "_id": "60d5ec49f1b2c...",
      "name": "Jane Doe",
      "interest": "Drawing",
      "email": "jane@example.com"
      // ...other fields
    },
    {
      "_id": "60d5ec49f1b2c...",
      "name": "John Smith",
      "interest": "Drawing and Sketching",
      "email": "john@example.com"
    }
  ]
}
```
