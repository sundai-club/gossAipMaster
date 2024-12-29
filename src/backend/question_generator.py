import openai
import random

class QuestionGenerator:
    def __init__(self, api_key):
        self.api_key = api_key
        openai.api_key = api_key

    def generate_questions(self, data, max_questions=5):
        questions = []
        for topic, url in data[:max_questions]:
            prompt, correct_answer_position = self._create_prompt(topic, url)
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant for generating fun gossip questions based on the provided data."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000,
                )
                question = response["choices"][0]["message"]["content"].strip()
                questions.append({
                    "topic": topic,
                    "question": question,
                    "correct_answer_position": correct_answer_position,
                    "url": url
                })
            except Exception as e:
                print(f"Error generating question for topic '{topic}': {e}")
        return questions

    def _create_prompt(self, topic, url):
        correct_answer_position = random.randint(0, 3)
        prompt = f"""
        Instruction: Generate a "Guess the correct gossip" question based on the provided topic. The question must:
        1. Include a real name, place, or country derived from the topic in the correct option.
        2. Use the entity (name, place, or country) meaningfully in both correct and incorrect options to ensure they sound plausible.
        3. Ensure the question is simple, engaging, and easy to read.
        4. Format the options as an array of strings.
        5. Place the correct answer in the position {correct_answer_position} of the options array (0-based index).
        
        Data: "{topic}"
        
        Please provide the output strictly in the following JSON format:
        ```
        {{
        "id": "1",
        "text": "Guess the correct gossip from the available options:",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": {correct_answer_position},
        "topic": "Celebrity Gossip",
        "url": "{url}"
        }}
        ```
        Output:
        """
        return prompt, correct_answer_position
