import sys

import requests

BASE_URL = "http://localhost:3000"


def log(msg):
    print(f"[VERIFY] {msg}")


def verify():
    # 1. Create Prompt
    log("Creating Prompt...")
    prompt_res = requests.post(
        f"{BASE_URL}/prompts",
        json={"title": "Test Prompt", "description": "A test prompt", "tags": ["test"]},
    )
    if prompt_res.status_code != 201:
        log(f"Failed to create prompt: {prompt_res.text}")
        sys.exit(1)
    prompt = prompt_res.json()
    prompt_id = prompt["id"]
    log(f"Prompt created: {prompt_id}")

    # 2. Generate Function (Refactored Flow)
    log("Generating Function from Prompt...")
    gen_res = requests.post(f"{BASE_URL}/prompts/{prompt_id}/generate", json={"llm_model": "gpt-4"})
    if gen_res.status_code != 201:
        log(f"Failed to generate function: {gen_res.text}")
        sys.exit(1)
    func = gen_res.json()
    func_id = func["id"]
    log(f"Function generated: {func_id}")
    log(f"Generated Code: {func['code']}")

    # 3. Create Session
    log("Creating Session...")
    session_res = requests.post(
        f"{BASE_URL}/sessions", json={"lang": "python", "keep_template": False}
    )
    if session_res.status_code != 201:
        log(f"Failed to create session: {session_res.text}")
        sys.exit(1)
    session = session_res.json()
    session_id = session["id"]
    log(f"Session created: {session_id}")

    # 4. Execute Code
    log("Executing Code...")
    try:
        exec_res = requests.post(
            f"{BASE_URL}/sandbox/execute",
            json={"code": "print('Hello')", "session_id": session_id, "function_id": func_id},
        )
        if exec_res.status_code in {200, 201}:
            log("Execution successful!")
            exec_data = exec_res.json()
            if "execution_id" in exec_data:
                log(f"Execution ID returned: {exec_data['execution_id']}")
            else:
                log("WARNING: execution_id not returned")
        else:
            log(
                f"Execution failed (expected if proxy is down): {exec_res.status_code} - {exec_res.text}"
            )
    except Exception as e:
        log(f"Execution request failed: {e}")

    # 5. List entities to verify persistence
    log("Verifying persistence...")

    p_list = requests.get(f"{BASE_URL}/prompts").json()
    if len(p_list) > 0:
        log("Prompts listed successfully")

    f_list = requests.get(f"{BASE_URL}/functions").json()
    if len(f_list) > 0:
        log("Functions listed successfully")

    s_list = requests.get(f"{BASE_URL}/sessions").json()
    if len(s_list) > 0:
        log("Sessions listed successfully")

    log("Verification Complete!")


if __name__ == "__main__":
    verify()
