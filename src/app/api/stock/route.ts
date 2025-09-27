export const runtime = 'edge'

export async function GET() {
  try {
    const response = await fetch('https://plantsvsbrainrotsstocktracker.com/api/stock', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Categorize the data by type (seeds and gears)
    const categorizedData = {
      seeds: data.data.filter((item: any) => item.type === 'seed'),
      gears: data.data.filter((item: any) => item.type === 'gear'),
      timestamp: data.timestamp,
      source: data.source
    }

    return Response.json(categorizedData)
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return Response.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}
