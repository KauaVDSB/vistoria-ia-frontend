'use client';

import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import type { User as UserType } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSupabaseLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });

      if (error) throw error;

      if (data.session) {
        // Salva o Token JWT no localStorage para o Flask usar nas requisições
        localStorage.setItem('token', data.session.access_token);
        
        // Determina a role (Mock dinâmico alinhado com o Flask)
        const role = loginEmail === 'admin@teste.com' ? 'admin' : 'staff';
        
        onLogin({
          id: data.user.id,
          email: data.user.email || loginEmail,
          nome: role === 'admin' ? 'Gestor' : 'Operador',
          role: role,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de Autenticação",
        description: error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSupabaseLogin(email, password);
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full mt-6 bg-primary h-12 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Access Demo */}
      <div className="mt-8 w-full max-w-sm">
        <div className="relative mb-4 flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Acesso rápido (demo)</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-primary"
            onClick={() => handleSupabaseLogin('admin@teste.com', 'Vistoria2026!')}
            disabled={isLoading}
          >
            <Shield className="w-5 h-5 text-primary" />
            <p className="font-medium text-sm">Admin</p>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-green-500"
            onClick={() => handleSupabaseLogin('staff@teste.com', 'Vistoria2026!')}
            disabled={isLoading}
          >
            <User className="w-5 h-5 text-green-600" />
            <p className="font-medium text-sm">Staff</p>
          </Button>
        </div>
      </div>
    </div>
  );
}