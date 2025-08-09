'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Logo } from '@/components/layout/Logo';
import Image from 'next/image';
import { useEffect, useState, Suspense } from 'react';
import { getPostLoginRedirectUrl } from '@/lib/navigation-helpers';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

// Componente interno que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason) {
      setLogoutReason(reason);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get('redirectTo');
      const targetUrl = redirectTo || getPostLoginRedirectUrl(user.profile, '/');
      router.push(targetUrl);
    }
  }, [user, router, searchParams]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      
      toast({
        title: t('auth.login.success.title'),
        description: t('auth.login.success.description'),
      });

      // La redirección se maneja en el useEffect cuando el usuario se actualiza
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: t('auth.login.error.title'),
        description: error.message || t('auth.login.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLogoutMessage = (reason: string) => {
    switch (reason) {
      case 'session_expired':
        return {
          icon: <Clock className="h-4 w-4" />,
          title: t('auth.logout.session_expired.title'),
          description: t('auth.logout.session_expired.description'),
        };
      case 'unauthorized':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: t('auth.logout.unauthorized.title'),
          description: t('auth.logout.unauthorized.description'),
        };
      case 'manual':
        return {
          icon: <Clock className="h-4 w-4" />,
          title: t('auth.logout.manual.title'),
          description: t('auth.logout.manual.description'),
        };
      default:
        return null;
    }
  };

  const logoutMessage = logoutReason ? getLogoutMessage(logoutReason) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            {t('auth.login.title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Logout Message */}
        {logoutMessage && (
          <Alert className="border-orange-200 bg-orange-50 text-orange-800">
            <div className="flex items-center gap-2">
              {logoutMessage.icon}
              <AlertDescription>
                <strong>{logoutMessage.title}</strong>
                <br />
                {logoutMessage.description}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Login Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              {t('auth.login.form.title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.login.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.login.form.email.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('auth.login.form.email.placeholder')}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.login.form.password.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('auth.login.form.password.placeholder')}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('auth.login.form.submit')}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {t('auth.login.form.no_account')}
              </span>{' '}
              <Link
                href="/signup"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.login.form.signup_link')}
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t('auth.login.form.forgot_password')}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            {t('auth.login.footer.terms_prefix')}{' '}
            <Link href="/terms" className="underline hover:text-primary">
              {t('auth.login.footer.terms')}
            </Link>{' '}
            {t('auth.login.footer.and')}{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              {t('auth.login.footer.privacy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente principal que envuelve LoginForm en Suspense
export default function LoginClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}