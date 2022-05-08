import { createTheme, NextUIProvider } from '@nextui-org/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './NotFound'
import { Scrappers } from './scrappers/Scrappers'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppHome } from './home/AppHome'
import { DevPage } from './dev/DevPage'
import { ScheduleViewer } from './schedule-viewer/ScheduleViewer'
import { useState } from 'react'

const queryClient = new QueryClient()

function useDynamicTheme() {
  const getColorScheme = () => window.matchMedia('(prefers-color-scheme: dark)')
  const [darkModePreference, setDarkModePreference] = useState<boolean>(
    getColorScheme().matches,
  )
  getColorScheme().addEventListener('change', (e) => {
    setDarkModePreference(e.matches)
  })

  return createTheme({
    type: darkModePreference ? 'dark' : 'light',
  })
}

export default function App() {
  const dynamicTheme = useDynamicTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={dynamicTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppHome />} />
            <Route path="/scrappers/" element={<Scrappers />} />
            <Route path="/app/" element={<ScheduleViewer />} />
            <Route path="/dev/" element={<DevPage />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </QueryClientProvider>
  )
}
