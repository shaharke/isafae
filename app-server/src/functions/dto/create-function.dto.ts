import { Type, Static } from '@sinclair/typebox';

export const CreateFunctionSchema = Type.Object({
    prompt_id: Type.String(),
    name: Type.String(),
    code: Type.String(),
    lang: Type.Optional(Type.String({ default: 'python' })),
    llm_model: Type.String(),
    libraries: Type.Optional(Type.Array(Type.String(), { default: [] })),
    user_id: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Any()),
});

export type CreateFunctionDto = Static<typeof CreateFunctionSchema>;
