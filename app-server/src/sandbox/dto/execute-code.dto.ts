import { Type, Static } from '@sinclair/typebox';

export const ExecuteCodeSchema = Type.Object({
    code: Type.String(),
    lang: Type.Optional(Type.String({ default: 'python' })),
    keep_template: Type.Optional(Type.Boolean({ default: false })),
    libraries: Type.Optional(Type.Array(Type.String(), { default: [] })),
});

export type ExecuteCodeDto = Static<typeof ExecuteCodeSchema>;
