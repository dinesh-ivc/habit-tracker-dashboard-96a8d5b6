'use client';

import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to register a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}