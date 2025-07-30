
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Logo } from '@/components/layout/Logo';
import Image from 'next/image';

const signupSchema = z
  .object({
    fullName: z.string().min(2, { message: 'Full name is required.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    const { error } = await signup(values.fullName, values.email, values.password);

    if (error) {
      toast({
        title: t('signup.toast.error.title'),
        description: error.message || "An unknown error occurred during signup.",
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('signup.toast.success.title'),
        description: t('signup.toast.success.description'),
      });
      // The onAuthStateChange listener in AuthContext will handle user state
      // and redirect to the home page after successful signup and login.
      router.push('/'); 
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
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">{t('signup.title')}</CardTitle>
                    <CardDescription>
                    {t('signup.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('signup.name')}</FormLabel>
                                <FormControl>
                                <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('signup.confirmPassword')}</FormLabel>
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
                            t('signup.button')
                            )}
                        </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        {t('signup.hasAccount')}{' '}
                        <Link href="/login" className="underline">
                        {t('login.title')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://qlbuwoyugbwpzzwdflsq.supabase.co/storage/v1/object/public/logo//bailey-anselme-Bkp3gLygyeA-unsplash.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="modern kitchen"
        />
      </div>
    </div>
  );
}
