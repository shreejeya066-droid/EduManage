import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          {/* Imported ErrorBoundary inside the component or at top level */}
          <AppRouter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
 
export default App;
