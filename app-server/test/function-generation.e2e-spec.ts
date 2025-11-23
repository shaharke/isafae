import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreatePromptDto } from '../src/prompts/dto/create-prompt.dto';
import { GenerateFunctionDto } from '../src/prompts/dto/generate-function.dto';
import { ExecuteCodeDto } from '../src/sandbox/dto/execute-code.dto';



describe('Function Generation and Execution (e2e)', () => {
    let app: INestApplication;
    jest.setTimeout(60000);

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    const waitForProxy = async (url: string, timeout = 30000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try {
                const res = await fetch(url);
                if (res.ok) return;
            } catch (_) { }
            await new Promise(r => setTimeout(r, 500));
        }
        throw new Error('Proxy did not become ready in time');
    };

    beforeAll(async () => {
        process.env.PROXY_SERVER_URL = 'http://localhost:8001';
        process.env.PROXY_SERVER_TIMEOUT = '60000';
        process.env.DATABASE_URL = 'postgresql://isafae_test_user:test_password@localhost:5433/isafae_test';
        await waitForProxy(`${process.env.PROXY_SERVER_URL}/`);
    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should create a prompt, generate a function, and execute it', async () => {
        // 1. Create Prompt
        const createPromptDto: CreatePromptDto = {
            title: 'Add two numbers',
            description: 'Write a function that adds two numbers',
            input_schema: {},
            output_schema: {},
            tags: ['math', 'test'],
            user_id: 'test-user',
        };

        const createPromptResponse = await request(app.getHttpServer())
            .post('/prompts')
            .send(createPromptDto)
            .expect(201);

        const promptId = createPromptResponse.body.id;
        expect(promptId).toBeDefined();

        // 2. Generate Function
        const generateFunctionDto: GenerateFunctionDto = {
            llm_model: 'gpt-4',
        };

        const generateResponse = await request(app.getHttpServer())
            .post(`/prompts/${promptId}/generate`)
            .send(generateFunctionDto)
            .expect(201);

        const generatedFunction = generateResponse.body;
        expect(generatedFunction).toBeDefined();
        expect(generatedFunction.code).toBeDefined();
        expect(generatedFunction.name).toBe('add_two_numbers');

        // 3. Execute Function
        // Note: The mock generator creates a function that returns {"status": "success"}
        // We will use the generated code to verify execution.
        const executeCodeDto: ExecuteCodeDto = {
            code: generatedFunction.code + '\nprint(add_two_numbers({}))', // Call the function
            lang: 'python',
        };

        const executeResponse = await request(app.getHttpServer())
            .post('/sandbox/execute')
            .send(executeCodeDto)
            .expect(201);

        const executionResult = executeResponse.body;
        expect(executionResult).toBeDefined();
        // The mock function prints "This is a generated function stub for: Add two numbers"
        // and returns {"status": "success"}
        // Since we appended a print call, we expect the output to contain the return value as well.
        // However, the sandbox execution result structure depends on the implementation.
        // Let's check if it ran successfully.
        expect(executionResult.stdout).toContain('This is a generated function stub for: Add two numbers');
    });
});
