'use client';

import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="underline hover:text-primary">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}