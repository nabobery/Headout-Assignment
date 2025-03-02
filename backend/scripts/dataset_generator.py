import os
import json
import time
import random
import openai
import google.generativeai as genai
import groq
from typing import List, Dict, Any
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logging.basicConfig(filename='api_calls.log', level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Set API keys (Ensure they are set as environment variables)
openai.api_key = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
groq_client = groq.Client(api_key=os.getenv("GROQ_API_KEY"))

# List of cities (you can expand this)
cities = [
    "London", "New York", "Paris", "Tokyo", "Singapore", "Rome", "Madrid", "Barcelona",
    "Berlin", "Sydney", "Istanbul", "Dubai", "Amsterdam", "Hong Kong", "San Francisco",
    "Los Angeles", "Chicago", "Toronto", "Melbourne", "Vienna", "Bangkok", "Lisbon",
    "Milan", "Seoul", "Buenos Aires", "Mexico City", "São Paulo", "Mumbai", "Shanghai",
    "Beijing", "Copenhagen", "Dublin", "Edinburgh", "Prague", "Brussels", "Moscow",
    "Stockholm", "Zurich", "Athens", "Kuala Lumpur", "Jakarta", "Manila", "Lima",
    "Bogotá", "Santiago", "Cape Town", "Johannesburg", "Tel Aviv", "Riyadh", "Doha",
    "Oslo", "Helsinki", "Warsaw", "Budapest", "Munich", "Hamburg", "Frankfurt",
    "Brisbane", "Perth", "Auckland", "Wellington", "Montreal", "Vancouver", "Calgary",
    "Ottawa", "Quebec City", "Havana", "Kingston", "Casablanca", "Marrakech", "Nairobi",
    "Lagos", "Accra", "Cairo", "Istanbul", "Ankara", "Tehran", "Karachi", "Lahore",
    "Dhaka", "Colombo", "Kathmandu", "Hanoi", "Ho Chi Minh City", "Phnom Penh", "Yangon",
    "Baghdad", "Damascus", "Beirut", "Amman", "Kuwait City", "Muscat", "Islamabad",
    "Tashkent", "Riga", "Tallinn", "Vilnius", "Bucharest", "Belgrade", "Sofia",
    "Skopje", "Sarajevo", "Podgorica"
]

# Destination structure
class Destination:
    def __init__(self, name: str, alias: str, clues: List[str], fun_facts: List[str]):
        self.name = name
        self.alias = alias
        self.clues = clues
        self.fun_facts = fun_facts

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "alias": self.alias,
            "clues": self.clues,
            "fun_facts": self.fun_facts
        }

# Function to handle API retries
def fetch_with_retries(api_func, city_name: str, max_retries=3):
    for attempt in range(max_retries):
        try:
            return api_func(city_name)
        except openai.RateLimitError:
            print(f"Rate limit reached for OpenAI on attempt {attempt + 1}. Retrying...")
            logging.warning(f"Rate limit reached for OpenAI on attempt {attempt + 1}. Retrying...")
        except Exception as e:
            print(f"API error: {e}. Retrying in {2**attempt} seconds...")
            logging.exception(f"API error on attempt {attempt + 1}: {e}. Retrying in {2**attempt} seconds...")
        time.sleep(2**attempt)  # Exponential backoff
    print(f"Failed to fetch data for {city_name} after {max_retries} attempts.")
    logging.error(f"Failed to fetch data for {city_name} after {max_retries} attempts.")
    return {"clues": [], "fun_facts": []}  # Return empty fallback

# Function to generate data using OpenAI
def get_openai_data(city_name: str) -> Dict[str, List[str]]:
    prompt = f"Provide 5 cryptic clues and 5 fun facts about {city_name} in JSON format."
    logging.info(f"OpenAI prompt: {prompt}")
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a travel expert and quiz creator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    logging.info(f"OpenAI raw response: {response}")
    return json.loads(response.choices[0].message.content)

# Function to generate data using Google Gemini AI
def get_gemini_data(city_name: str) -> Dict[str, List[str]]:
    prompt = f"Provide 5 cryptic clues and 5 fun facts about {city_name} in JSON format. Return ONLY the JSON, without any surrounding text or backticks."
    logging.info(f"Gemini prompt: {prompt}")
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    logging.info(f"Gemini raw response: {response.text}")
    if response.text:
        try:
            # Extract JSON string from within backticks
            json_string = response.text.strip().removeprefix("```json").removesuffix("```").strip()

            logging.info(f"Extracted JSON string: {json_string}")


            # Check if json_string is empty after removing backticks
            if not json_string:
                print(f"Warning: Gemini returned an empty JSON string for {city_name}.")
                logging.warning(f"Gemini returned an empty JSON string for {city_name}.")
                return {"clues": [], "fun_facts": []}

            data = json.loads(json_string)

            # Extract clues and fun facts from the nested structure
            clues = [item["clue"] for item in data.get("cryptic_clues", [])]
            fun_facts = [item["fact"] for item in data.get("fun_facts", [])]
            return {"clues": clues, "fun_facts": fun_facts}

        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(f"Error processing Gemini response: {e}")
            logging.error(f"Error processing Gemini response: {e}")
            return {"clues": [], "fun_facts": []}
    else:
        print(f"Warning: Gemini returned an empty response for {city_name}.")
        logging.warning(f"Gemini returned an empty response for {city_name}.")
        return {"clues": [], "fun_facts": []}  # Return empty fallback

# Function to generate data using Groq AI
def get_groq_data(city_name: str) -> Dict[str, List[str]]:
    prompt = f"Provide 5 cryptic clues and 5 fun facts about {city_name} in JSON format. Return ONLY the JSON, without any surrounding text or backticks."
    logging.info(f"Groq prompt: {prompt}")
    response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": "You are a travel expert and quiz creator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    logging.info(f"Groq raw response: {response}")

    try:
        # Extract the content string
        content = response.choices[0].message.content

        # Extract JSON string from within backticks, handling different variations
        if "```json" in content:
            json_string = content.strip().removeprefix("```json").removesuffix("```").strip()
        elif "```" in content:
            json_string = content.strip().removeprefix("```").removesuffix("```").strip()
        else:  # No backticks, assume it's the whole content (less likely, but safer)
            json_string = content

        logging.info(f"Extracted JSON string: {json_string}")

        # Check for empty string
        if not json_string:
            print(f"Warning: Groq returned an empty JSON string for {city_name}.")
            logging.warning(f"Groq returned an empty JSON string for {city_name}.")
            return {"clues": [], "fun_facts": []}

        data = json.loads(json_string)

        # Extract clues and fun facts, adapting to Groq's key names
        clues = [item["Clue"] for item in data.get("Cryptic Clues", [])]
        fun_facts = [item["Fact"] for item in data.get("Fun Facts", [])]
        return {"clues": clues, "fun_facts": fun_facts}

    except (json.JSONDecodeError, KeyError, TypeError, AttributeError) as e:
        print(f"Error processing Groq response: {e}")
        logging.error(f"Error processing Groq response: {e}")
        return {"clues": [], "fun_facts": []}

# Function to generate data from all three LLMs
def generate_destination_data(city_name: str) -> Destination:
    print(f"Generating data for {city_name}...")

    # Random alias
    alias = f"dst{random.randint(1000, 9999)}"

    # Get data from different models with retries
    # openai_data = fetch_with_retries(get_openai_data, city_name)
    openai_data = {
        "clues": [],
        "fun_facts": []
    }
    gemini_data = fetch_with_retries(get_gemini_data, city_name)
    groq_data = fetch_with_retries(get_groq_data, city_name)

    # Merge results, using any available data
    clues = list(set(openai_data["clues"] + gemini_data["clues"] + groq_data["clues"]))
    fun_facts = list(set(openai_data["fun_facts"] + gemini_data["fun_facts"] + groq_data["fun_facts"]))

    # Fallback if all APIs fail
    if not clues:
        clues = [f"A famous location known as {city_name}", "A popular tourist destination"]
    if not fun_facts:
        fun_facts = [f"Located in a fascinating region", f"{city_name} has a rich history"]

    return Destination(name=city_name, alias=alias, clues=clues[:5], fun_facts=fun_facts[:5])

# Main function
def main():
    all_destinations = []

    for city in cities:
        destination = generate_destination_data(city)
        all_destinations.append(destination.to_dict())

        # Delay to prevent rate limiting
        time.sleep(1)

    # Save to JSON
    with open('destinations.json', 'w') as f:
        json.dump(all_destinations, f, indent=2)

    print(f"Generated data for {len(all_destinations)} cities")
    print("Data saved to destinations.json")

if __name__ == "__main__":
    main()
