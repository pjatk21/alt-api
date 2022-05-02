import { createTheme, NextUIProvider } from '@nextui-org/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './NotFound'
import { Scrappers } from './scrappers/Scrappers'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppHome } from './home/AppHome'
import { DevPage } from './dev/DevPage'
import { ScheduleViewer } from './schedule-viewer/ScheduleViewer'

const queryClient = new QueryClient()

const darkTheme = createTheme({
  type: 'dark',
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppHome />} />
            <Route path="scrappers/" element={<Scrappers />} />
            <Route path="app/" element={<ScheduleViewer />} />
            <Route path="dev/" element={<DevPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </QueryClientProvider>
  )
}

export default App
