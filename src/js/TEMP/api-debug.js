// API Debug Utility for troubleshooting API issues

export const debugApiRequest = async (url, headers, apiKey) => {
  console.group('🔍 API Debug Information')
  console.log('Request URL:', url)
  console.log(
    'API Key:',
    apiKey ? `${apiKey.substring(0, 10)}...` : 'Not provided',
  )
  console.log('Headers:', headers)

  try {
    // Test with fetch to see if it's an Axios-specific issue
    console.log('Testing with native fetch...')
    const fetchResponse = await fetch(url, {
      method: 'GET',
      headers: headers,
    })

    console.log('Fetch Response Status:', fetchResponse.status)
    console.log(
      'Fetch Response Headers:',
      Object.fromEntries(fetchResponse.headers.entries()),
    )

    if (fetchResponse.ok) {
      const data = await fetchResponse.json()
      console.log('Fetch Response Data:', data)
    } else {
      const errorText = await fetchResponse.text()
      console.log('Fetch Error Response:', errorText)
    }
  } catch (fetchError) {
    console.log('Fetch Error:', fetchError.message)
  }

  // Test with different header combinations
  console.log('Testing different header combinations...')

  const headerVariations = [
    { 'api-key': apiKey },
    { Authorization: `Bearer ${apiKey}` },
    { 'X-API-Key': apiKey },
    { 'api-key': apiKey, 'Content-Type': 'application/json' },
    { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
  ]

  for (let i = 0; i < headerVariations.length; i++) {
    const testHeaders = headerVariations[i]
    console.log(`Testing headers ${i + 1}:`, testHeaders)

    try {
      const testResponse = await fetch(url, {
        method: 'GET',
        headers: testHeaders,
      })
      console.log(`  Status: ${testResponse.status}`)
      if (testResponse.status === 200) {
        console.log('  ✅ Success with these headers!')
        break
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`)
    }
  }

  console.groupEnd()
}

export const validateApiKey = (apiKey) => {
  if (!apiKey) {
    console.error('❌ API Key is missing')
    return false
  }

  if (apiKey.length < 10) {
    console.error('❌ API Key seems too short')
    return false
  }

  if (!apiKey.startsWith('API-')) {
    console.warn('⚠️ API Key doesn\'t start with "API-" prefix')
  }

  console.log('✅ API Key format looks valid')
  return true
}

export const checkApiEndpoint = async (baseUrl) => {
  try {
    console.log('Checking API endpoint availability...')

    // Try to reach the base URL
    const response = await fetch(baseUrl, {
      method: 'HEAD',
      mode: 'no-cors', // This will help avoid CORS issues
    })

    console.log('Base URL response:', response)
  } catch (error) {
    console.log('Base URL check failed:', error.message)
  }
}
