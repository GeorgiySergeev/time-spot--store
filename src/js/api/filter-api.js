const getBrands = async () => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/content/items/watch?limit=1`,
    {
      headers: { 'Api-Key': API_CONFIG.API_KEY },
    },
  )
}
