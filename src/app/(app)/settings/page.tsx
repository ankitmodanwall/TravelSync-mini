'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });
  
  useEffect(() => {
    if (user) {
        form.reset({ name: user.name || '' });
    }
  }, [user, form]);


  const onSubmit = async (data: ProfileFormValues) => {
    if (!updateUserProfile) return;
    try {
      await updateUserProfile({ name: data.name });
      toast({
        title: 'Profile Updated',
        description: 'Your name has been successfully updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2 animate-fade-in-up animation-delay-200">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      <div className="animate-scale-in animation-delay-200 smooth-transition hover:-translate-y-1">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User />
            Profile Settings
          </CardTitle>
           <CardDescription>
            This is how your name will be displayed in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormDescription>
                     Please enter your full name or a display name you are comfortable with.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                    className="smooth-transition hover:scale-105 active:scale-95"
                  >
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
