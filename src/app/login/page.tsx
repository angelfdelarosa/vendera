
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

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

// Componente interno que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
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

  const {
    formState: { isSubmitting },
  } = form;

  // Check for logout reason in URL params
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason) {
      setLogoutReason(reason);
      
      // Show toast notification for auto-logout
      if (reason === 'inactivity') {
        toast({
          title: 'Sesión Expirada',
          description: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
          variant: 'destructive',
        });
      }
    }
  }, [searchParams, toast]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { error } = await login(values.email, values.password);

    if (error) {
      toast({
        title: t('login.toast.error.title'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('login.toast.success.title'),
        description: t('login.toast.success.description'),
      });
      router.push('/');
      router.refresh(); // Refresh server components
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="flex justify-center">
                <Link href="/landing">
                    <Logo layout="vertical" />
                </Link>
            </div>
            {/* Show logout reason alert */}
            {logoutReason === 'inactivity' && (
              <Alert className="mb-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Tu sesión anterior expiró por inactividad (15 minutos sin actividad).
                </AlertDescription>
              </Alert>
            )}
            
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">{t('login.title')}</CardTitle>
                    <CardDescription>
                        {t('login.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('contact.form.email')}</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="m@example.com"
                                    type="email"
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
                                <FormLabel>{t('login.password')}</FormLabel>
                                <FormControl>
                                <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                            ) : (
                            t('login.button')
                            )}
                        </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        {t('login.noAccount')}{' '}
                        <Link href="/signup" className="underline">
                        {t('signup.title')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://qlbuwoyugbwpzzwdflsq.supabase.co/storage/v1/object/public/logo//login_image.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="modern kitchen"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="flex justify-center">
              <Link href="/landing">
                <Logo layout="vertical" />
              </Link>
            </div>
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">Iniciar Sesión</CardTitle>
                <CardDescription>
                  Cargando...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="https://qlbuwoyugbwpzzwdflsq.supabase.co/storage/v1/object/public/logo//login_image.png"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            data-ai-hint="modern kitchen"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
