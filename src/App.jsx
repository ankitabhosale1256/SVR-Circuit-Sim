import { Routes, Route } from 'react-router-dom';
import Loginpage from './components/Loginpage';
import SignupPage from './components/SignupPage';
import ForgotPassword from './components/ForgotPassword';
import DashboardA from './components/DashboardA';
import DashboardB from './components/DashboardB';
import DashboardC from './components/DashboardC';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Loginpage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboardA" element={<DashboardA />} />
      <Route path="/dashboardB" element={<DashboardB />} />
      <Route path="/dashboardC" element={<DashboardC />} />
    </Routes>
  );
}

export default App;
