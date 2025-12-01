import { useState } from 'react';
import './MainPage.css';

interface PromptData {
    title: string;
    description: string;
    input_schema?: object;
    output_schema?: object;
}

interface GeneratedFunction {
    id: string;
    code: string;
    name: string;
    lang: string;
    libraries: string[];
}

interface ExecutionResult {
    stdout: string;
    stderr: string;
    exit_code: number;
    execution_id: string;
}

export const MainPage = () => {
    const [step, setStep] = useState<'prompt' | 'function' | 'execute'>('prompt');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Prompt state
    const [promptData, setPromptData] = useState<PromptData>({
        title: '',
        description: '',
    });
    const [promptId, setPromptId] = useState<string | null>(null);

    // Function state
    const [generatedFunction, setGeneratedFunction] = useState<GeneratedFunction | null>(null);

    // Execute state
    const [inputData, setInputData] = useState('{}');
    const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

    const handleCreatePrompt = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptData),
            });

            if (!response.ok) throw new Error('Failed to create prompt');

            const prompt = await response.json();
            setPromptId(prompt.id);
            setStep('function');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFunction = async () => {
        if (!promptId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3000/prompts/${promptId}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!response.ok) throw new Error('Failed to generate function');

            const func = await response.json();
            setGeneratedFunction(func);
            setStep('execute');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleExecuteFunction = async () => {
        if (!generatedFunction) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/sandbox/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: generatedFunction.code,
                    lang: generatedFunction.lang,
                    libraries: generatedFunction.libraries,
                    function_id: generatedFunction.id,
                }),
            });

            if (!response.ok) throw new Error('Failed to execute function');

            const result = await response.json();
            setExecutionResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep('prompt');
        setPromptData({ title: '', description: '' });
        setPromptId(null);
        setGeneratedFunction(null);
        setInputData('{}');
        setExecutionResult(null);
        setError(null);
    };

    return (
        <div className="main-page">
            <header className="main-header">
                <h1>Prompt Playground</h1>
                <p>Create prompts, generate functions, and test execution</p>
            </header>

            <div className="workflow-steps">
                <div className={`step ${step === 'prompt' ? 'active' : ''} ${promptId ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Create Prompt</div>
                </div>
                <div className="step-divider"></div>
                <div className={`step ${step === 'function' ? 'active' : ''} ${generatedFunction ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Generate Function</div>
                </div>
                <div className="step-divider"></div>
                <div className={`step ${step === 'execute' ? 'active' : ''} ${executionResult ? 'completed' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Execute</div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="content">
                {step === 'prompt' && (
                    <div className="step-content">
                        <h2>Step 1: Create Prompt</h2>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={promptData.title}
                                onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
                                placeholder="e.g., Add two numbers"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={promptData.description}
                                onChange={(e) => setPromptData({ ...promptData, description: e.target.value })}
                                placeholder="Describe what the function should do..."
                                rows={6}
                            />
                        </div>
                        <button
                            onClick={handleCreatePrompt}
                            disabled={loading || !promptData.title || !promptData.description}
                            className="btn-primary"
                        >
                            {loading ? 'Creating...' : 'Create Prompt & Continue'}
                        </button>
                    </div>
                )}

                {step === 'function' && (
                    <div className="step-content">
                        <h2>Step 2: Generate Function</h2>
                        <div className="info-box">
                            <p><strong>Prompt:</strong> {promptData.title}</p>
                            <p>{promptData.description}</p>
                        </div>
                        <button
                            onClick={handleGenerateFunction}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Generating...' : 'Generate Function'}
                        </button>

                        {generatedFunction && (
                            <div className="result-box">
                                <h3>Generated Function</h3>
                                <div className="code-display">
                                    <pre><code>{generatedFunction.code}</code></pre>
                                </div>
                                <div className="metadata">
                                    <span><strong>Name:</strong> {generatedFunction.name}</span>
                                    <span><strong>Language:</strong> {generatedFunction.lang}</span>
                                    <span><strong>Libraries:</strong> {generatedFunction.libraries.join(', ') || 'None'}</span>
                                </div>
                                <button onClick={() => setStep('execute')} className="btn-primary">
                                    Continue to Execute
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'execute' && generatedFunction && (
                    <div className="step-content">
                        <h2>Step 3: Execute Function</h2>
                        <div className="code-display-compact">
                            <strong>Function:</strong> {generatedFunction.name}
                            <pre><code>{generatedFunction.code}</code></pre>
                        </div>

                        <div className="form-group">
                            <label>Input Data (JSON)</label>
                            <textarea
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                                placeholder='{"key": "value"}'
                                rows={4}
                            />
                        </div>

                        <button
                            onClick={handleExecuteFunction}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Executing...' : 'Execute Function'}
                        </button>

                        {executionResult && (
                            <div className="result-box">
                                <h3>Execution Result</h3>
                                <div className={`output-section ${executionResult.exit_code === 0 ? 'success' : 'error'}`}>
                                    <div className="output-header">
                                        <strong>Exit Code:</strong> {executionResult.exit_code}
                                        {executionResult.exit_code === 0 ? ' ✓' : ' ✗'}
                                    </div>
                                    {executionResult.stdout && (
                                        <div className="output-block">
                                            <strong>Output (stdout):</strong>
                                            <pre>{executionResult.stdout}</pre>
                                        </div>
                                    )}
                                    {executionResult.stderr && (
                                        <div className="output-block">
                                            <strong>Errors (stderr):</strong>
                                            <pre>{executionResult.stderr}</pre>
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleReset} className="btn-secondary">
                                    Start New Test
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
