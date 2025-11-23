-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'TERMINATED', 'FAILED');

-- CreateEnum
CREATE TYPE "FunctionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'DEPRECATED');

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "lang" TEXT NOT NULL DEFAULT 'python',
    "keep_template" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminated_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "input_schema" JSONB,
    "output_schema" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "functions" (
    "id" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'python',
    "version" INTEGER NOT NULL DEFAULT 1,
    "llm_model" TEXT NOT NULL,
    "libraries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "FunctionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "functions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
    "function_id" TEXT,
    "session_id" TEXT,
    "user_id" TEXT,
    "code" TEXT NOT NULL,
    "input_params" JSONB,
    "stdout" TEXT NOT NULL DEFAULT '',
    "stderr" TEXT NOT NULL DEFAULT '',
    "exit_code" INTEGER NOT NULL,
    "execution_time_ms" INTEGER NOT NULL,
    "libraries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_status_created_at_idx" ON "sessions"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "prompts_user_id_created_at_idx" ON "prompts"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "prompts_tags_idx" ON "prompts"("tags");

-- CreateIndex
CREATE INDEX "functions_prompt_id_version_idx" ON "functions"("prompt_id", "version" DESC);

-- CreateIndex
CREATE INDEX "functions_user_id_idx" ON "functions"("user_id");

-- CreateIndex
CREATE INDEX "functions_name_lang_idx" ON "functions"("name", "lang");

-- CreateIndex
CREATE INDEX "executions_function_id_created_at_idx" ON "executions"("function_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "executions_session_id_created_at_idx" ON "executions"("session_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "executions_user_id_created_at_idx" ON "executions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "executions_exit_code_created_at_idx" ON "executions"("exit_code", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "functions" ADD CONSTRAINT "functions_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_function_id_fkey" FOREIGN KEY ("function_id") REFERENCES "functions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
