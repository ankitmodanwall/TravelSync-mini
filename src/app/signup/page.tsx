'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { Logo } from '@/components/logo';
import { placeholderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await signup(values.email, values.password, values.name);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'This email is already registered.'
            : 'An unexpected error occurred.',
      });
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ['name'];
    if (step === 2) fieldsToValidate = ['email'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  const loginHeroImage = placeholderImages.find(p => p.id === 'login-hero');

  const progressValue = (step / 3) * 100;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">

      {/* Background */}
      {loginHeroImage && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={loginHeroImage.imageUrl}
            alt={loginHeroImage.description}
            fill
            className="object-cover brightness-[0.4]"
          />
        </motion.div>
      )}

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-background/80 backdrop-blur-md border border-white/10 shadow-xl">

          {/* Header */}
          <CardHeader className="text-center">
            <motion.div
              className="mb-4 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Logo />
            </motion.div>

            <CardTitle className="text-3xl font-bold font-headline">
              Sign Up
            </CardTitle>

            <CardDescription>
              Join us to start planning your next adventure.
            </CardDescription>
          </CardHeader>

          <CardContent>

            {/* Progress */}
            <div className="mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.3 }}
              >
                <Progress value={progressValue} />
              </motion.div>

              <p className="mt-2 text-center text-sm text-muted-foreground">
                Step {step} of 3
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 relative"
              >

                {/* Back Button */}
                {step > 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      className="absolute left-0 -top-10"
                      type="button"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </motion.div>
                )}

                {/* STEP ANIMATION */}
                <AnimatePresence mode="wait">

                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="m@example.com"
                                {...field}
                                type="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* BUTTONS */}
                {step < 3 ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="button" onClick={handleNext} className="w-full">
                      Continue
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? 'Creating Account...'
                        : 'Create Account'}
                    </Button>
                  </motion.div>
                )}

                {/* Google Auth */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={loginWithGoogle}
                  >
                    Sign Up with Google
                  </Button>
                </motion.div>

              </form>
            </Form>

            {/* Login link */}
            <motion.div
              className="mt-4 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </motion.div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}