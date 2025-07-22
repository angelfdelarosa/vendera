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
  prompt: `Eres un experto inmobiliario especializado en escribir anuncios de propiedades.

  Basándote en los detalles de la propiedad, crea una descripción atractiva y llamativa para atraer a posibles compradores.

  Tipo de Propiedad: {{{propertyType}}}
  Ubicación: {{{location}}}
  Dormitorios: {{{numBedrooms}}}
  Baños: {{{numBathrooms}}}
  Comodidades: {{{amenities}}}
  Características Únicas: {{{uniqueFeatures}}}

  Escribe una descripción de propiedad convincente:
  `,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {name: 'generatePropertyDescriptionFlow', inputSchema: GeneratePropertyDescriptionInputSchema, outputSchema: GeneratePropertyDescriptionOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
