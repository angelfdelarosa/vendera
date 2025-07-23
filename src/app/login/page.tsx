
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Authentication is currently disabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-center text-muted-foreground">
              Please browse the application without logging in.
            </p>
            <Button variant="outline" asChild>
                <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
      </Card>
    </div>
  );
}
