'use client';

import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import type { User as UserType } from '@/lib/types';
import { mockAdminUser, mockStaffUser } from '@/lib/mocks';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Conectar à API Flask
    // const response = await fetch('API_BASE_URL/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, senha: password }),
    // });
    // const data = await response.json();
    // if (data.token) {
    //   localStorage.setItem('token', data.token);
    //   onLogin(data.user);
    // }

    // Simula delay de API
    setTimeout(() => {
      setIsLoading(false);
      // Por padrão, logar como staff se o email contiver "joao" ou como admin
      if (email.toLowerCase().includes('joao')) {
        onLogin(mockStaffUser);
      } else {
        onLogin(mockAdminUser);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo & Title */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Truck className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Vistoria IA</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Auditoria Inteligente de Pátios
        </p>
      </div>

      {/* Login Form Card */}
      <Card className="w-full max-w-sm shadow-xl border-0 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Entrar</CardTitle>
          <CardDescription>
            Digite suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Access Demo */}
      <div className="mt-8 w-full max-w-sm">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Acesso rápido (demo)
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => onLogin(mockAdminUser)}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Admin</p>
              <p className="text-xs text-muted-foreground">Validar vistorias</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-green-500 hover:bg-green-50 transition-all"
            onClick={() => onLogin(mockStaffUser)}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Staff</p>
              <p className="text-xs text-muted-foreground">Executar vistorias</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
