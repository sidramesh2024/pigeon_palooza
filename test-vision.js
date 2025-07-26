// Test script to verify Google Cloud Vision API setup
const vision = require('@google-cloud/vision');
const fs = require('fs');

async function testVisionAPI() {
  try {
    console.log('🧪 Testing Google Cloud Vision API...');
    
    // Check if service account file exists
    if (!fs.existsSync('./nycsilly.json')) {
      console.error('❌ nycsilly.json file not found in project root');
      return;
    }
    
    console.log('✅ Service account file found');
    
    // Initialize client
    const client = new vision.ImageAnnotatorClient({
      keyFilename: './nycsilly.json'
    });
    
    console.log('✅ Vision client initialized');
    
    // Test with a simple base64 image (1x1 pixel)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(testImage.split(',')[1], 'base64');
    
    console.log('🔍 Testing label detection...');
    const [result] = await client.labelDetection({ image: { content: imageBuffer } });
    
    console.log('✅ API call successful!');
    console.log('📝 Labels found:', result.labelAnnotations?.length || 0);
    
    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      console.log('🏷️ Sample labels:', result.labelAnnotations.slice(0, 3).map(l => l.description));
    }
    
    console.log('🎉 Google Cloud Vision API is working correctly!');
    
  } catch (error) {
    console.error('💥 Error testing Vision API:');
    console.error('Type:', error.constructor.name);
    console.error('Message:', error.message);
    
    if (error.code) {
      console.error('API Error Code:', error.code);
    }
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.error('🔐 Suggestion: Check if Vision API is enabled in Google Cloud Console');
    } else if (error.message.includes('authentication')) {
      console.error('🔑 Suggestion: Verify service account credentials');
    }
  }
}

testVisionAPI(); 