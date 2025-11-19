# Contributing to isafae

Thank you for contributing to the LLM Sandbox Web Server project! This guide will help you set up your development environment and understand our workflow.

## Development Setup

### Prerequisites

- Python 3.10 or higher
- Docker (or Colima on macOS)
- [uv](https://github.com/astral-sh/uv) - Fast Python package manager

### Installing uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or using pip
pip install uv
```

### Setting Up the Project

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd isafae
   ```

2. **Create a virtual environment and install dependencies**:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv sync
   ```

3. **Install pre-commit hooks**:
   ```bash
   pre-commit install
   ```

4. **Set up Docker (if using Colima on macOS)**:
   ```bash
   brew install colima
   colima start
   export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock
   ```

## Development Workflow

### Code Quality Tools

We use modern Python tooling to maintain high code quality:

- **Ruff**: Fast linting and formatting (replaces Black, isort, Flake8)
- **mypy**: Static type checking
- **pytest**: Testing framework
- **pytest-cov**: Code coverage analysis
- **pre-commit**: Automated quality checks before commits

### Running Linters and Formatters

```bash
# Run Ruff linter (with auto-fix)
ruff check . --fix

# Run Ruff formatter
ruff format .

# Run both linting and formatting
ruff check . --fix && ruff format .
```

### Type Checking

```bash
# Run mypy on the app directory
mypy app/

# Run mypy on specific files
mypy app/main.py app/api/routes.py
```

### Running Tests

```bash
# Run all tests
pytest

# Run only unit tests (fast, no Docker required)
pytest -m unit

# Run only e2e tests (require Docker)
pytest -m e2e

# Run with coverage
pytest --cov=app --cov-report=html --cov-report=term

# View coverage report
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
```

### Pre-commit Hooks

Pre-commit hooks run automatically before each commit. To run them manually:

```bash
# Run on all files
pre-commit run --all-files

# Run on staged files only
pre-commit run
```

If you need to skip pre-commit hooks (not recommended):
```bash
git commit --no-verify
```

## Code Style Guidelines

### Type Hints

All functions should have type hints:

```python
from typing import Optional

def execute_code(code: str, libraries: Optional[list[str]] = None) -> dict[str, str]:
    """Execute code in a sandbox."""
    # Implementation
    return {"stdout": "", "stderr": "", "exit_code": 0}
```

### Imports

Imports are automatically sorted by Ruff. The order is:
1. Standard library imports
2. Third-party imports
3. Local application imports

### Docstrings

Use Google-style docstrings:

```python
def create_session(lang: str, keep_template: bool = False) -> str:
    """Create a new sandbox session.

    Args:
        lang: Programming language for the sandbox.
        keep_template: Whether to keep the template after session ends.

    Returns:
        The session ID.

    Raises:
        ValueError: If the language is not supported.
    """
    pass
```

## Testing Guidelines

### Unit Tests

- Located in `tests/unit/`
- Use mocks for external dependencies
- Should be fast (< 1 second each)
- Mark with `@pytest.mark.unit`

Example:
```python
import pytest
from unittest.mock import Mock

@pytest.mark.unit
def test_create_session():
    # Test implementation
    pass
```

### E2E Tests

- Located in `tests/e2e/`
- Use real Docker containers
- May be slower
- Mark with `@pytest.mark.e2e`

Example:
```python
import pytest

@pytest.mark.e2e
def test_execute_python_code():
    # Test implementation with real Docker
    pass
```

## Adding Dependencies

### Production Dependencies

```bash
uv add fastapi
uv add "requests>=2.31.0"
```

### Development Dependencies

```bash
uv add --dev pytest-mock
uv add --dev ruff
```

### Updating Dependencies

```bash
# Update all dependencies
uv sync --upgrade

# Update specific package
uv add fastapi --upgrade
```

## Project Structure

```
isafae/
├── app/                    # Application source code
│   ├── api/               # API routes
│   ├── core/              # Core configuration
│   ├── models/            # Pydantic models
│   └── services/          # Business logic
├── tests/                 # Test suite
│   ├── unit/             # Unit tests (mocked)
│   └── e2e/              # End-to-end tests (real Docker)
├── pyproject.toml        # Project configuration and dependencies
├── .pre-commit-config.yaml  # Pre-commit hooks configuration
└── README.md             # User documentation
```

## Continuous Integration

Our CI pipeline runs on every pull request:

1. Linting with Ruff
2. Type checking with mypy
3. Unit tests
4. E2E tests (if Docker is available)
5. Coverage reporting

Make sure all checks pass before requesting a review.

## Common Issues

### Docker Connection Issues

If you see Docker connection errors:

```bash
# For Colima users
export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock

# Verify Docker is running
docker ps
```

### Import Errors

Make sure you're in the virtual environment:

```bash
source .venv/bin/activate
```

### Type Checking Errors

If mypy complains about missing type stubs:

```bash
uv add --dev types-<package-name>
```

## Getting Help

- Check existing issues on GitHub
- Review the [README.md](README.md) for usage documentation
- Ask questions in pull request discussions

## License

By contributing, you agree that your contributions will be licensed under the GPL-3.0 License.
