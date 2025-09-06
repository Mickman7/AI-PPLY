import './styles/index.css'
import AppRoutes from './routes/AppRoutes'
import { ResumeProvider } from './context/ResumeContext';


function App() {
  return (
    <ResumeProvider>
      <AppRoutes />
    </ResumeProvider>
  )
}

export default App
