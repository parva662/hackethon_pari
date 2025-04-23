import requests
import json
from typing import Dict, Any

def test_combine_endpoint(card1: str, card2: str, constraints: str = "") -> Dict[str, Any]:
    """Test the /supervisor/combine endpoint"""
    url = "http://localhost:8000/supervisor/combine"
    payload = {
        "card1": card1,
        "card2": card2,
        "constraints": constraints
    }
    
    print(f"\nTesting combine endpoint with:")
    print(f"Card 1: {card1}")
    print(f"Card 2: {card2}")
    print(f"Constraints: {constraints}")
    
    response = requests.post(url, json=payload)
    return response.json()

def test_ask_endpoint(query: str) -> Dict[str, Any]:
    """Test the /supervisor/ask endpoint"""
    url = "http://localhost:8000/supervisor/ask"
    payload = {
        "query": query
    }
    
    print(f"\nTesting ask endpoint with query:")
    print(f"Query: {query}")
    
    response = requests.post(url, json=payload)
    return response.json()

def main():
    # Test cases for combine endpoint
    test_cases = [
        {
            "card1": "football",
            "card2": "dance",
            "constraints": "Make it fun for girls and playable indoors"
        },
        {
            "card1": "basketball",
            "card2": "yoga",
            "constraints": "Focus on balance and coordination"
        },
        {
            "card1": "running",
            "card2": "tag",
            "constraints": "Good for large groups"
        }
    ]
    
    # Test cases for ask endpoint
    ask_test_cases = [
        "How can I make a game more inclusive?",
        "What safety considerations should I keep in mind?",
        "How can I adapt a game for different age groups?"
    ]
    
    print("Starting API tests...")
    
    # Test combine endpoint
    print("\n=== Testing Combine Endpoint ===")
    for test_case in test_cases:
        try:
            result = test_combine_endpoint(
                test_case["card1"],
                test_case["card2"],
                test_case["constraints"]
            )
            print("\nResponse:")
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"Error testing combine endpoint: {str(e)}")
    
    # Test ask endpoint
    print("\n=== Testing Ask Endpoint ===")
    for query in ask_test_cases:
        try:
            result = test_ask_endpoint(query)
            print("\nResponse:")
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"Error testing ask endpoint: {str(e)}")

if __name__ == "__main__":
    main() 