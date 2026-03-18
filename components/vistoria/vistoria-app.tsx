'use client';

import { useState } from 'react';
import { LoginScreen } from './login-screen';
import { AdminDashboard } from './admin-dashboard';
import { StaffDashboard } from './staff-dashboard';
import { ExecutionScreen } from './execution-screen';
import type { User, Screen, Atribuicao } from '@/lib/types';

export function VistoriaApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedVistoria, setSelectedVistoria] = useState<Atribuicao | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen(user.role === 'admin' ? 'admin' : 'staff');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setSelectedVistoria(null);
    // TODO: Limpar token
    // localStorage.removeItem('token');
  };

  const handleSelectVistoria = (atribuicao: Atribuicao) => {
    setSelectedVistoria(atribuicao);
    setCurrentScreen('execucao');
  };

  const handleBackFromExecution = () => {
    setSelectedVistoria(null);
    setCurrentScreen('staff');
  };

  const handleCompleteVistoria = () => {
    setSelectedVistoria(null);
    setCurrentScreen('staff');
  };

  // Render based on current screen
  switch (currentScreen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;

    case 'admin':
      return currentUser ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : null;

    case 'staff':
      return currentUser ? (
        <StaffDashboard
          user={currentUser}
          onLogout={handleLogout}
          onSelectVistoria={handleSelectVistoria}
        />
      ) : null;

    case 'execucao':
      return selectedVistoria ? (
        <ExecutionScreen
          atribuicao={selectedVistoria}
          onBack={handleBackFromExecution}
          onComplete={handleCompleteVistoria}
        />
      ) : null;

    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}
