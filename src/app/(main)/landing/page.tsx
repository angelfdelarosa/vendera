
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { MessageSquare, Search, Home, Star, ShieldCheck } from 'lucide-react';
import { TestimonialCard, type Testimonial } from '@/components/layout/TestimonialCard';
import { mockUsers, properties as mockProperties } from '@/lib/mock-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';


export default function LandingPage() {
  const { t } = useTranslation();
  const featuredProperties = mockProperties.slice(0, 6);
  
  const testimonials: Testimonial[] = [
    {
      quote: t('landing.testimonials.quote1'),
      name: 'Sarah & Tom',
      role: t('landing.testimonials.role1'),
      avatar: 'https://images.unsplash.com/photo-1542327897-4141c5336f2c?q=80&w=2574&auto=format&fit=crop',
    },
    {
      quote: t('landing.testimonials.quote2'),
      name: mockUsers['jane-doe-realtor'].name,
      role: t('landing.testimonials.role2'),
      avatar: mockUsers['jane-doe-realtor'].avatar,
    },
     {
      quote: t('landing.testimonials.quote3'),
      name: 'Michael Rodriguez',
      role: t('landing.testimonials.role3'),
      avatar: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=2574&auto=format&fit=crop',
    }
  ];
  
  const features = [
    {
      icon: Search,
      title: t('landing.features.feature1_title'),
      description: t('landing.features.feature1_desc'),
    },
    {
      icon: Home,
      title: t('landing.features.feature2_title'),
      description: t('landing.features.feature2_desc'),
    },
    {
      icon: MessageSquare,
      title: t('landing.features.feature3_title'),
      description: t('landing.features.feature3_desc'),
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 bg-primary/5">
        <div className="container mx-auto px-4 z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4">
            {t('landing.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">{t('landing.hero.cta_main')}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/about">{t('landing.hero.cta_secondary')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl font-bold text-primary text-center mb-2">
            {t('landing.featured.title')}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
             {t('landing.featured.subtitle')}
          </p>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}
                className="w-full"
                >
                <CarouselContent>
                    {featuredProperties.map((property, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <PropertyCard property={property} isClickable={false} />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-card py-16 md:py-24 border-t border-b">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="font-headline text-4xl font-bold text-primary mb-2">
                {t('about.whyTitle')}
             </h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('about.whySubtitle')}
             </p>
           </div>
           <div className="grid md:grid-cols-3 gap-10 text-center">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
           </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl font-bold text-primary text-center mb-2">
            {t('landing.testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
             {t('landing.testimonials.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="bg-primary/5 py-16 md:py-24 border-t">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold text-primary mb-4">
                {t('landing.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {t('landing.cta.subtitle')}
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">{t('signup.button')}</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
    
