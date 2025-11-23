import { Type, Static } from '@sinclair/typebox';

export const GenerateFunctionSchema = Type.Object({
  llm_model: Type.Optional(Type.String({ default: 'gpt-4' })),
});

export type GenerateFunctionDto = Static<typeof GenerateFunctionSchema>;
