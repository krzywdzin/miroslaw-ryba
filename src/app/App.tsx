import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { GraphUploadPage, GraphViewPage } from '@/features/graph'
import { EnvironmentPage } from '@/features/environment'
import { SimulationPage } from '@/features/simulation'
import { ReportPage, HistoryPage } from '@/features/reports'
import { ChatPage } from '@/features/chat'
import { NotFoundPage } from '@/features/errors/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'graph', element: <GraphUploadPage /> },
      { path: 'graph/view', element: <GraphViewPage /> },
      { path: 'environment', element: <EnvironmentPage /> },
      { path: 'simulation', element: <SimulationPage /> },
      { path: 'report/:simulationId', element: <ReportPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'chat/:simulationId', element: <ChatPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
