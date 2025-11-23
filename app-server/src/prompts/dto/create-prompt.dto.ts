import { Type, Static } from '@sinclair/typebox';

export const CreatePromptSchema = Type.Object({
    title: Type.String(),
    description: Type.String(),
    input_schema: Type.Optional(Type.Any()),
    output_schema: Type.Optional(Type.Any()),
    tags: Type.Optional(Type.Array(Type.String(), { default: [] })),
    user_id: Type.Optional(Type.String()),
});

export type CreatePromptDto = Static<typeof CreatePromptSchema>;
