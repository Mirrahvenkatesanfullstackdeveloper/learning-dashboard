import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../store/slices/authSlice';
import { useState } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (!result.error && !isNavigating) {
      setIsNavigating(true);
      setTimeout(() => {
        navigate('/');
        setIsNavigating(false);
      }, 100);
    }
    return result;
  };

  const handleRegister = async (userData) => {
    const result = await dispatch(register(userData));
    if (!result.error && !isNavigating) {
      setIsNavigating(true);
      setTimeout(() => {
        navigate('/');
        setIsNavigating(false);
      }, 100);
    }
    return result;
  };

  const handleLogout = async () => {
    await dispatch(logout());
    if (!isNavigating) {
      setIsNavigating(true);
      setTimeout(() => {
        navigate('/login');
        setIsNavigating(false);
      }, 100);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};