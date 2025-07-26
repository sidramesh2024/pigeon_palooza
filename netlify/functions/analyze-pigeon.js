const vision = require('@google-cloud/vision');

// NYC Landmarks with bonus points
const NYC_LANDMARKS = [
  { name: 'Empire State Building', bonus: 50 },
  { name: 'Times Square', bonus: 45 },
  { name: 'Brooklyn Bridge', bonus: 40 },
  { name: 'Statue of Liberty', bonus: 60 },
  { name: 'One World Trade Center', bonus: 45 },
  { name: 'Central Park', bonus: 30 },
  { name: 'High Line', bonus: 25 },
  { name: 'Washington Square Park', bonus: 25 },
  { name: 'Coney Island', bonus: 30 },
  { name: '9/11 Memorial', bonus: 40 },
  { name: 'Other NYC Location', bonus: 10 },
];

// NYC slang templates for descriptions
const NYC_DESCRIPTIONS = [
  "This pigeon's got that classic {landmark} swagger - definitely born and raised in the five boroughs!",
  "Spotted this absolute unit strutting around {landmark} like they own the place. Respect!",
  "This bird's giving major NYC energy at {landmark} - probably judges tourists better than any Yelp review.",
  "Pure Brooklyn attitude on display at {landmark}. This pigeon's seen some things and ain't impressed.",
  "This feathered New Yorker at {landmark} is serving looks and attitude in equal measure.",
  "Straight outta {landmark}, this pigeon's got more street cred than most subway musicians.",
  "This bird at {landmark} is giving off serious 'I've been here since the 90s' vibes.",
  "Caught this pigeon at {landmark} throwing shade at tourists - peak NYC behavior right here!"
];

// Initialize Google Cloud Vision client
let visionClient = null;

function initializeVisionClient() {
  if (!visionClient) {
    try {
      console.log('🔧 Initializing Google Cloud Vision client...');
      
      // Check if environment variable exists
      const serviceAccountJson = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT;
      if (!serviceAccountJson) {
        throw new Error('GOOGLE_CLOUD_SERVICE_ACCOUNT environment variable not found');
      }
      
      console.log('📝 Service account JSON length:', serviceAccountJson.length);
      
      // Parse service account JSON
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log('✅ Service account JSON parsed successfully');
        console.log('📋 Project ID:', serviceAccount.project_id);
        console.log('📧 Client email:', serviceAccount.client_email);
      } catch (parseError) {
        console.error('❌ Failed to parse service account JSON:', parseError.message);
        throw new Error('Invalid JSON in GOOGLE_CLOUD_SERVICE_ACCOUNT');
      }
      
      // Initialize Vision client
      visionClient = new vision.ImageAnnotatorClient({
        credentials: serviceAccount,
        projectId: serviceAccount.project_id
      });
      
      console.log('✅ Google Cloud Vision client initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Vision client:', error.message);
      throw error;
    }
  }
  return visionClient;
}

// Analyze image for pigeon characteristics
function analyzePigeonFromVision(labels, objects, faces) {
  console.log('🔍 Analyzing pigeon characteristics from Vision data...');
  
  let attitudeRating = 3; // Base rating
  let strutRating = 3;
  let touristJudgingRating = 3;

  // Check for confident/bold features
  const boldFeatures = ['Bird', 'Pigeon', 'Beak', 'Eye', 'Feather', 'Wing'];
  const confidenceFeatures = labels.filter(label => 
    boldFeatures.some(feature => label.description.toLowerCase().includes(feature.toLowerCase())) &&
    label.score > 0.8
  );

  if (confidenceFeatures.length > 2) {
    attitudeRating = Math.min(5, attitudeRating + 1);
  }

  // Check for posture indicators
  const postureKeywords = ['Perched', 'Standing', 'Sitting', 'Walking'];
  const postureFeatures = labels.filter(label =>
    postureKeywords.some(keyword => label.description.toLowerCase().includes(keyword.toLowerCase()))
  );

  if (postureFeatures.length > 0) {
    strutRating = Math.min(5, strutRating + 1);
  }

  // Check for urban environment indicators
  const urbanFeatures = ['Building', 'Street', 'Sidewalk', 'Urban', 'City', 'Concrete'];
  const urbanObjects = labels.filter(label =>
    urbanFeatures.some(feature => label.description.toLowerCase().includes(feature.toLowerCase()))
  );

  if (urbanObjects.length > 1) {
    touristJudgingRating = Math.min(5, touristJudgingRating + 1);
  }

  // Check for people or crowds (more tourist judging opportunities)
  const peopleFeatures = labels.filter(label =>
    ['Person', 'Human', 'People', 'Crowd'].some(keyword => 
      label.description.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  if (peopleFeatures.length > 0) {
    touristJudgingRating = Math.min(5, touristJudgingRating + 1);
  }

  // Random variation for personality
  const randomVariation = () => Math.floor(Math.random() * 2); // 0 or 1
  
  attitudeRating = Math.min(5, Math.max(1, attitudeRating + randomVariation() - randomVariation()));
  strutRating = Math.min(5, Math.max(1, strutRating + randomVariation() - randomVariation()));
  touristJudgingRating = Math.min(5, Math.max(1, touristJudgingRating + randomVariation() - randomVariation()));

  console.log('📊 Generated ratings:', { attitudeRating, strutRating, touristJudgingRating });
  
  return { attitudeRating, strutRating, touristJudgingRating };
}

exports.handler = async (event, context) => {
  console.log('🚀 Netlify function started');
  console.log('🔍 HTTP Method:', event.httpMethod);
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('❌ Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📝 Parsing request body...');
    const { imageData, landmark } = JSON.parse(event.body);

    if (!imageData || !landmark) {
      console.log('❌ Missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing image data or landmark' }),
      };
    }

    console.log('📍 Landmark:', landmark);
    console.log('🖼️ Image data length:', imageData.length);

    // Initialize Vision client
    console.log('🤖 Initializing Google Cloud Vision...');
    const client = initializeVisionClient();

    // Convert base64 to buffer
    console.log('🔄 Converting image data...');
    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
    console.log('📦 Image buffer size:', imageBuffer.length, 'bytes');

    // Analyze image with Google Cloud Vision
    console.log('📸 Calling Google Cloud Vision API...');
    
    const [labelResult] = await client.labelDetection({ image: { content: imageBuffer } });
    console.log('✅ Label detection completed');
    
    const [objectResult] = await client.objectLocalization({ image: { content: imageBuffer } });
    console.log('✅ Object localization completed');
    
    const [faceResult] = await client.faceDetection({ image: { content: imageBuffer } });
    console.log('✅ Face detection completed');

    const labels = labelResult.labelAnnotations || [];
    const objects = objectResult.localizedObjectAnnotations || [];
    const faces = faceResult.faceAnnotations || [];

    console.log('📊 Vision API results summary:', {
      labelsCount: labels.length,
      objectsCount: objects.length,
      facesCount: faces.length
    });

    console.log('🏷️ Top labels:', labels.slice(0, 5).map(l => ({ 
      description: l.description, 
      score: Math.round(l.score * 100) + '%' 
    })));

    // Analyze pigeon characteristics
    const { attitudeRating, strutRating, touristJudgingRating } = analyzePigeonFromVision(labels, objects, faces);

    // Get landmark bonus points
    const landmarkInfo = NYC_LANDMARKS.find(l => l.name === landmark);
    const bonusPoints = landmarkInfo?.bonus || 10;

    // Calculate overall score
    const baseScore = (attitudeRating + strutRating + touristJudgingRating) / 3;
    const overallScore = Math.min(5.0, baseScore + (bonusPoints / 100));

    // Generate fun NYC description
    const randomTemplate = NYC_DESCRIPTIONS[Math.floor(Math.random() * NYC_DESCRIPTIONS.length)];
    const funDescription = randomTemplate.replace('{landmark}', landmark);

    const result = {
      attitudeRating,
      strutRating,
      touristJudgingRating,
      overallScore: parseFloat(overallScore.toFixed(2)),
      funDescription,
      bonusPoints,
      visionAnalysis: {
        labels: labels.slice(0, 5).map(l => ({ description: l.description, score: l.score })),
        objects: objects.slice(0, 3).map(o => ({ name: o.name, score: o.score }))
      }
    };

    console.log('✅ Analysis completed successfully');
    console.log('📋 Final result:', {
      ratings: `${attitudeRating}/${strutRating}/${touristJudgingRating}`,
      overall: overallScore,
      bonus: bonusPoints
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('💥 ERROR in analyze-pigeon function:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if it's a Vision API specific error
    if (error.message.includes('GOOGLE_CLOUD_SERVICE_ACCOUNT')) {
      console.error('🔑 Environment variable issue detected');
    } else if (error.code) {
      console.error('🌐 Google API error code:', error.code);
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to analyze pigeon. Check function logs for details.',
        details: error.message,
        type: error.constructor.name
      }),
    };
  }
}; 