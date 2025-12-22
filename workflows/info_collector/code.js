// Google Custom Search API configuration
const apiKey = '{API key}';
const cx = '{cx key}';

const keyword = $input.first().json.Keyword;
const afterDate = $input.first().json['After Date'];
const beforeDate = $input.first().json['Before Date'];
const query = `${keyword} after:${afterDate} before:${beforeDate}`;

const baseUrl = 'https://www.googleapis.com/customsearch/v1';

// Array to store all items
let allItems = [];

// Make 10 requests with different start indices
const startIndices = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91];

for (let i = 0; i < startIndices.length; i++) {
  const start = startIndices[i];
  
  // Add delay before each request (except the first one)
  if (i > 0) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const url = `${baseUrl}?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;

  try {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: url,
      json:  true
    });

    // Add items from this response to our collection
    if (response.items && Array.isArray(response.items)) {
      allItems = allItems.concat(response.items);
    }
  } catch (error) {
    // Handle 429 or other errors gracefully
    if (error.statusCode === 429) {
      console.log(`Rate limit hit at index ${start}, waiting longer...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Optionally retry the request here
    } else {
      console.log(`Error at index ${start}:`, error.message);
    }
  }
}

// Return all items as a single array
return allItems. map(item => ({ json: item }));
