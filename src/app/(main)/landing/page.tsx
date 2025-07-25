
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { MessageSquare, Search, Home, Star, ShieldCheck, ArrowRight } from 'lucide-react';
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
      name: 'Jane Doe',
      role: t('landing.testimonials.role2'),
      avatar: mockUsers['jane-doe-realtor'].avatar_url || 'https://placehold.co/100x100.png',
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
      <section className="relative overflow-hidden bg-card">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-screen">
                {/* Image Column */}
                <div className="relative h-[600px] hidden lg:flex items-center justify-center">
                    <svg
                        className="absolute w-full h-full"
                        viewBox="0 0 500 600"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <clipPath id="custom-shape">
                                <path d="M410.9,1.4c-28.7,11.2-46.3,40.1-51.9,70.1c-13.3,71.2-41.2,141-86.4,196.2C226.9,324.2,176,368,131.7,422.5c-22.1,27.2-40,58.9-42.5,93.4c-2,27.1,9,53.8,29.1,70.9l291.2-192c30.2-20,49.2-53,51.8-88.5c2.6-35.5-12.8-69.5-41.2-90.8C384,289.4,342,246,310.8,197.2C287.1,159.3,272.1,117.1,268.4,73C265.6,37.3,279.7,3.1,304.6-6.6l106.3,7.9Z" />
                            </clipPath>
                        </defs>
                        <image 
                            href="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxidXlpbmc2MjUyMGElMjBob3VzZXxlbnwwfHx8fDE3NTQ0MTU0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                            width="100%" 
                            height="100%" 
                            clipPath="url(#custom-shape)"
                            preserveAspectRatio="xMidYMid slice"
                            data-ai-hint="happy couple new house"
                        />
                    </svg>
                </div>
                {/* Text Column */}
                <div className="text-center lg:text-left py-20 lg:py-0">
                    <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-6">
                        {t('landing.hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10">
                        {t('landing.hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Button size="lg" asChild>
                            <Link href="/signup">{t('landing.hero.cta_main')} <ArrowRight /></Link>
                        </Button>
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/about">{t('landing.hero.cta_secondary')}</Link>
                        </Button>
                    </div>
                </div>
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
    
