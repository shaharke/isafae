import { Type, Static } from '@sinclair/typebox';

export const CreateExecutionSchema = Type.Object({
    function_id: Type.Optional(Type.String()),
    session_id: Type.Optional(Type.String()),
    user_id: Type.Optional(Type.String()),
    code: Type.String(),
    input_params: Type.Optional(Type.Any()),
    stdout: Type.String(),
    stderr: Type.String(),
    exit_code: Type.Integer(),
    execution_time_ms: Type.Integer(),
    libraries: Type.Optional(Type.Array(Type.String(), { default: [] })),
});

export type CreateExecutionDto = Static<typeof CreateExecutionSchema>;
