'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a compelling property description from key details and features.
 *
 * The flow takes property details as input and returns a generated description.
 * @interface GeneratePropertyDescriptionInput - The input type for the generatePropertyDescription function.
 * @interface GeneratePropertyDescriptionOutput - The output type for the generatePropertyDescription function.
 * @function generatePropertyDescription - A function that calls the generatePropertyDescriptionFlow to generate a property description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  propertyType: z.string().describe('The type of property (e.g., apartment, house, villa).'),
  location: z.string().describe('The location of the property.'),
  price: z.number().describe('The rental price of the property.'),
  numBedrooms: z.number().describe('The number of bedrooms in the property.'),
  numBathrooms: z.number().describe('The number of bathrooms in the property.'),
  amenities: z.string().describe('A comma-separated list of amenities (e.g., balcony, parking, swimming pool).'),
  description: z.string().optional().describe('Optional, existing raw description of the property.'),
});

export type GeneratePropertyDescriptionInput = z.infer<
  typeof GeneratePropertyDescriptionInputSchema
>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling description of the property.'),
});

export type GeneratePropertyDescriptionOutput = z.infer<
  typeof GeneratePropertyDescriptionOutputSchema
>;

export async function generatePropertyDescription(
  input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `You are an expert real estate copywriter specializing in writing compelling property descriptions.

  Based on the following property details, write an engaging and attractive description for potential renters.
  Use a tone that is both professional and inviting, highlighting the key features and benefits of the property.

  Property Type: {{{propertyType}}}
  Location: {{{location}}}
  Price: {{{price}}} DA
  Bedrooms: {{{numBedrooms}}}
  Bathrooms: {{{numBathrooms}}}
  Amenities: {{{amenities}}}
  Existing Description: {{{description}}}

  Write a description that will attract renters. Make sure to include all relevant details and highlight the property's unique selling points.  The description should not be longer than 200 words.
`,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePropertyDescriptionFlow',
    inputSchema: GeneratePropertyDescriptionInputSchema,
    outputSchema: GeneratePropertyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
