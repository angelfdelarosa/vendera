'use server';

/**
 * @fileOverview Property description generator.
 *
 * - generatePropertyDescription - A function that generates a property description.
 * - GeneratePropertyDescriptionInput - The input type for the generatePropertyDescription function.
 * - GeneratePropertyDescriptionOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  propertyType: z.string().describe('The type of property (e.g., house, apartment, condo).'),
  location: z.string().describe('The location of the property.'),
  numBedrooms: z.number().describe('The number of bedrooms in the property.'),
  numBathrooms: z.number().describe('The number of bathrooms in the property.'),
  amenities: z.string().describe('A comma-separated list of amenities (e.g., garage, swimming pool, garden).'),
  uniqueFeatures: z.string().describe('A description of the unique features of the property.'),
});
export type GeneratePropertyDescriptionInput = z.infer<typeof GeneratePropertyDescriptionInputSchema>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling description of the property.'),
});
export type GeneratePropertyDescriptionOutput = z.infer<typeof GeneratePropertyDescriptionOutputSchema>;

export async function generatePropertyDescription(
  input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `You are a real estate expert specializing in writing property listings.

  Based on the details of the property, create an engaging and attractive description to attract potential buyers.

  Property Type: {{{propertyType}}}
  Location: {{{location}}}
  Bedrooms: {{{numBedrooms}}}
  Bathrooms: {{{numBathrooms}}}
  Amenities: {{{amenities}}}
  Unique Features: {{{uniqueFeatures}}}

  Write a compelling property description:
  `,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {name: 'generatePropertyDescriptionFlow', inputSchema: GeneratePropertyDescriptionInputSchema, outputSchema: GeneratePropertyDescriptionOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
