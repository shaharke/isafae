import { Type, Static } from '@sinclair/typebox';

export const CreateSessionSchema = Type.Object({
    lang: Type.Optional(Type.String({ default: 'python' })),
    keep_template: Type.Optional(Type.Boolean({ default: false })),
    user_id: Type.Optional(Type.String()), // Optional for now
    metadata: Type.Optional(Type.Any()),
});

export type CreateSessionDto = Static<typeof CreateSessionSchema>;
