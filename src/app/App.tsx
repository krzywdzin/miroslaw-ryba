import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { GraphUploadPage, GraphViewPage } from '@/features/graph'
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
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
