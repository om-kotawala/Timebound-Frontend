import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import App from './App'
import { store } from './store'
import { selectTheme } from './store/slices/uiSlice'
import './index.css'

const ThemedToaster = () => {
  const theme = useSelector(selectTheme)
  const isDarkTheme = theme === 'dark'

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDarkTheme ? 'rgb(var(--ink-700))' : 'rgb(var(--ink-900))',
          color: isDarkTheme ? 'rgb(var(--ink-100))' : 'rgb(var(--ink-50))',
          border: `1px solid ${isDarkTheme ? 'rgb(var(--ink-600))' : 'rgb(var(--ink-700))'}`,
          fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: 'rgb(var(--volt-300))', secondary: 'rgb(var(--accent-contrast))' } },
        error: { iconTheme: { primary: 'rgb(var(--coral-default))', secondary: 'rgb(var(--accent-contrast))' } },
      }}
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ThemedToaster />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
