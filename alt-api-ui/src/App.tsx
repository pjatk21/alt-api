import React from 'react'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Preview } from './calendar/Preview'
import { NotFound } from './NotFound'
import { ScrappersWrapper } from './scrappers/Scrappers'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppHome } from './home/AppHome'
import { ScheduleViewer } from './schedule-viewer/ScheduleViewer'
import { DevPage } from './dev/DevPage'

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
            <Route path="preview/" element={<Preview />} />
            <Route path="scrappers/" element={<ScrappersWrapper />} />
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
