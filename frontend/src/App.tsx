import './styles/index.css'
import AppRoutes from './routes/AppRoutes'
import { ResumeProvider } from './context/ResumeContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <ResumeProvider>
        <AppRoutes />
      </ResumeProvider>
    </UserProvider>
  )
}

export default App
