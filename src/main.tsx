import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { useLocationStore } from './lib/store'

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// Request location permission and set location if granted
const initLocation = async () => {
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      const data = await response.json()

      if (data.address) {
        const locationStore = useLocationStore.getState()
        locationStore.setLocation({
          id: `current-${Date.now()}`,
          name: data.address.city || data.address.town || data.address.village || 'Current Location',
          type: 'city',
          parent: {
            id: 'current',
            name: data.address.country,
            type: 'country'
          },
          coordinates: {
            latitude,
            longitude
          }
        })
      }
    } catch (error) {
      console.log('Location access denied or error:', error)
    }
  }
}

initLocation()

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
