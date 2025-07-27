import './App.css'
import { Tabs } from './components/tabs/Tabs'
import { ThemeProvider } from './contexts/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <Tabs />
    </ThemeProvider>
  );
}
