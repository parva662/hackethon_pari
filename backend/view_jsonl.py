import json

def read_jsonl(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            try:
                data = json.loads(line)
                print("\n=== Entry ===")
                print(json.dumps(data, indent=2))
                print("=" * 50)
            except json.JSONDecodeError as e:
                print(f"Error reading line: {e}")

if __name__ == "__main__":
    read_jsonl("game_library.jsonl") 