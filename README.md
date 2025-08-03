# Geospatial Dashboard

A comprehensive React/Next.js TypeScript dashboard for visualizing dynamic geospatial data with interactive maps, timeline controls, and polygon-based analysis.

## Features

### Core Functionality
- **Timeline Slider**: Interactive timeline with single-hour and range selection modes
- **Interactive Map**: Leaflet-based map with polygon drawing capabilities
- **Polygon Management**: Create, view, and delete polygons (3-12 points each)
- **Data Visualization**: Real-time weather data integration with color-coded polygons
- **Dynamic Updates**: Automatic polygon color updates based on timeline changes

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient state management
- **Responsive Design**: Ant Design components with custom styling
- **API Integration**: Open-Meteo weather API integration
- **Real-time Updates**: Dynamic data fetching and visualization

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **State Management**: Zustand
- **UI Framework**: Ant Design
- **Mapping**: React-Leaflet, Leaflet
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **API**: Open-Meteo Weather API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd geospatial-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Configuration

This application uses the **Open-Meteo API** which requires no API key. The API provides:
- Weather data including temperature, humidity, wind speed
- Historical and forecast data
- Hourly resolution data

**API Endpoint**: \`https://api.open-meteo.com/v1/forecast\`

No additional configuration is required as the API is free and doesn't require authentication.

## Usage Guide

### 1. Timeline Control
- **Single Mode**: Use the slider to select a specific hour
- **Range Mode**: Toggle the switch to select a time range
- **Navigation**: Drag the slider or click to jump to specific times

### 2. Drawing Polygons
1. Click "Draw Polygon" button
2. Click on the map to add points (minimum 3, maximum 12)
3. Press Enter to finish or Escape to cancel
4. Polygon will be automatically assigned to the current data source

### 3. Managing Data Sources
- View and manage color rules in the sidebar
- Add custom color rules with operators (\<, \<=, =, \>=, \>)
- Set threshold values and colors for data visualization
- Delete existing rules as needed

### 4. Polygon Management
- View all created polygons in the sidebar
- Delete polygons using the trash icon
- Polygons automatically update colors based on current timeline selection

## Project Structure

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── MapComponent.tsx   # Interactive map with drawing tools
│   ├── Sidebar.tsx        # Control panel and data source management
│   └── TimelineSlider.tsx # Timeline control component
├── hooks/                 # Custom React hooks
│   └── useWeatherData.ts  # Weather data fetching logic
├── store/                 # State management
│   └── useStore.ts        # Zustand store configuration
├── types/                 # TypeScript type definitions
│   └── index.ts           # Application types
└── utils/                 # Utility functions
    └── api.ts             # API helpers and data processing
\`\`\`

## Key Components

### TimelineSlider
- Dual-mode timeline control (single hour / range selection)
- 30-day window (15 days before/after current date)
- Hourly resolution with formatted tooltips

### MapComponent
- Interactive Leaflet map
- Polygon drawing with click-to-add-points
- Real-time polygon rendering with color updates
- Map controls for drawing and center reset

### Sidebar
- Polygon management interface
- Data source configuration
- Color rule management with visual feedback
- Legend display

## API Integration

### Open-Meteo Weather API
The application integrates with Open-Meteo API to fetch weather data:

- **Endpoint**: \`https://api.open-meteo.com/v1/forecast\`
- **Parameters**: latitude, longitude, hourly data, date range
- **Data Fields**: temperature_2m (2-meter temperature)
- **Resolution**: Hourly data points

### Data Processing
1. **Polygon Centroid**: Calculate center point for API queries
2. **Time Range Handling**: Fetch data for selected timeline range
3. **Value Averaging**: Average hourly values for range selections
4. **Color Application**: Apply user-defined color rules to data values

## Deployment

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with default Next.js settings
4. No environment variables required

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## Development Notes

### State Management
- Zustand store manages all application state
- Reactive updates trigger re-renders automatically
- Persistent polygon and rule storage

### Performance Considerations
- Dynamic imports for map components (SSR compatibility)
- Debounced API calls for timeline changes
- Efficient polygon rendering with color caching

### Browser Compatibility
- Modern browsers with ES6+ support
- Leaflet requires WebGL for optimal performance
- Responsive design for desktop and tablet use

## Troubleshooting

### Common Issues

1. **Map not loading**: Ensure Leaflet CSS is properly imported
2. **API errors**: Check network connectivity and API endpoint
3. **Polygon drawing issues**: Verify minimum 3 points before finishing
4. **Timeline not updating**: Check date range calculations

### Debug Mode
Enable debug logging by adding to your environment:
\`\`\`bash
NODE_ENV=development
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly with different polygon configurations
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`

## Future Enhancements

- Multiple data source support
- Polygon editing capabilities
- Data export functionality
- Advanced filtering options
- Mobile responsive design
- Offline data caching
