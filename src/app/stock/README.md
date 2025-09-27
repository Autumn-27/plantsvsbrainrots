# Stock Live Page

This page provides real-time stock tracking for Plants vs Brainrots seeds and gears.

## Features

- **Real-time Data**: Fetches live stock data from the external API
- **Auto-refresh**: Automatically refreshes every 5 minutes at fixed UTC intervals (e.g., 1:00, 1:05, 1:10 UTC)
- **Manual Refresh**: Users can manually refresh the data at any time
- **Countdown Timer**: Shows time remaining until next automatic refresh
- **Time Display**: Shows last update time in user's local timezone with full date and time
- **Categorized Display**: Separates seeds and gears into different sections
- **Stock Status**: Color-coded indicators for stock levels (In Stock, Low Stock, Out of Stock)
- **Rarity Display**: Shows item rarity with appropriate color coding
- **Image Support**: Displays item images with fallback handling

## API Endpoint

The page uses `/api/stock` which:
1. Fetches data from `https://plantsvsbrainrotsstocktracker.com/api/stock`
2. Categorizes items by type (seeds vs gears)
3. Returns structured data for the frontend

## Data Structure

```typescript
interface StockData {
  seeds: StockItem[]
  gears: StockItem[]
  timestamp: string
  source: string
}

interface StockItem {
  name: string
  stock: number
  available: boolean
  category: string
  type: string
  lastUpdated: string
}
```

## Refresh Logic

- **Automatic**: Every 5 minutes at fixed UTC intervals (not from page load time)
- **Manual**: User-triggered via refresh button
- **Countdown**: Shows remaining time until next refresh
- **Error Handling**: Graceful error handling with retry option

## UI Features

- **Dark Theme**: Modern dark theme consistent with the site
- **Responsive Design**: Works on mobile and desktop
- **Loading States**: Shows loading indicators during data fetch
- **Error States**: Displays error messages with retry options
- **Stock Indicators**: Visual indicators for stock levels and availability