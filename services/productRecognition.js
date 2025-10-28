import axios from 'axios';

// Google Cloud Vision API configuration
const VISION_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// EAN/barcode database API (example - you can use different providers)
const PRODUCT_DB_API = 'https://api.upcitemdb.com/prod/trial/lookup';

/**
 * Convert image to base64
 */
const imageToBase64 = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Detect text in image using Google Cloud Vision
 */
export const detectTextInImage = async (imageUri) => {
  try {
    const base64Image = await imageToBase64(imageUri);
    
    const response = await fetch(`${VISION_API_URL}?key=${VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 10,
              },
              {
                type: 'LABEL_DETECTION',
                maxResults: 20,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.responses && data.responses[0] && data.responses[0].textAnnotations) {
      return data.responses[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting text:', error);
    throw error;
  }
};

/**
 * Detect barcodes in image
 */
export const detectBarcode = async (imageUri) => {
  try {
    const base64Image = await imageToBase64(imageUri);
    
    const response = await fetch(`${VISION_API_URL}?key=${VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'BARCODE_DETECTION',
                maxResults: 10,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.responses && data.responses[0] && data.responses[0].barcodes) {
      const barcodes = data.responses[0].barcodes;
      if (barcodes.length > 0) {
        return barcodes[0].rawValue; // Return the barcode value
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting barcode:', error);
    throw error;
  }
};

/**
 * Lookup product by barcode using product database
 */
export const lookupProductByBarcode = async (barcode) => {
  try {
    const response = await axios.get(`${PRODUCT_DB_API}?upc=${barcode}`);
    
    if (response.data && response.data.items && response.data.items.length > 0) {
      const product = response.data.items[0];
      return {
        title: product.title,
        brand: product.brand,
        model: product.model,
        mpn: product.mpn,
        images: product.images,
        offers: product.offers || [],
        description: product.description,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error looking up product:', error);
    throw error;
  }
};

/**
 * Identify product from image
 * This combines text detection, barcode detection, and product lookup
 */
export const identifyProduct = async (imageUri) => {
  try {
    console.log('Starting product identification...');
    
    // Step 1: Try to detect barcode
    const barcode = await detectBarcode(imageUri);
    console.log('Barcode detected:', barcode);
    
    if (barcode) {
      // Step 2: Lookup product by barcode
      const product = await lookupProductByBarcode(barcode);
      console.log('Product found:', product);
      
      if (product) {
        return {
          success: true,
          type: 'barcode',
          barcode,
          product,
        };
      }
    }
    
    // Step 3: Fallback to text detection
    const textDetection = await detectTextInImage(imageUri);
    console.log('Text detected:', textDetection);
    
    if (textDetection) {
      return {
        success: true,
        type: 'text',
        textAnnotations: textDetection.textAnnotations,
        labels: textDetection.labelAnnotations,
      };
    }
    
    return {
      success: false,
      message: 'No product information could be extracted from the image',
    };
  } catch (error) {
    console.error('Error identifying product:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Search for products using keywords (mock implementation)
 * In a real app, you would use a product search API
 */
export const searchProducts = async (keywords) => {
  try {
    // Mock product search - replace with real API
    const mockProducts = [
      {
        id: '1',
        name: keywords,
        price: 199.99,
        merchant: 'Proshop',
        link: 'https://proshop.dk/shop/product',
        shipping: 29,
        delivery: '2-4 dage',
      },
    ];
    
    return {
      success: true,
      products: mockProducts,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

