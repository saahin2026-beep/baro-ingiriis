import asyncio
import os
import re
import edge_tts

WORDS = [
    "Hello", "Goodbye", "Thank you", "Please", "Sorry",
    "Welcome", "Good morning", "Good night", "How are you?", "I am fine",
    "Nice to meet you", "See you later", "Happy", "Sad", "Angry",
    "Tired", "Excited", "Scared", "Worried", "Surprised",
    "Proud", "Nervous", "Calm", "Confused", "Lonely",
    "Teacher", "Student", "Book", "Pen", "School",
    "Office", "Computer", "Meeting", "Homework", "Exam",
    "Boss", "Job", "Colleague", "Car", "Bus",
    "Airplane", "Train", "Bicycle", "Boat", "Taxi",
    "Road", "Airport", "Ticket", "Driver", "Walk",
]

OUTPUT_DIR = "public/audio/wotd"
VOICE = "en-US-AriaNeural"

def slugify(text):
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug

async def generate_audio(word):
    slug = slugify(word)
    path = os.path.join(OUTPUT_DIR, f"{slug}.mp3")
    if os.path.exists(path):
        print(f"  ✓ {word} (exists)")
        return
    communicate = edge_tts.Communicate(word, VOICE)
    await communicate.save(path)
    print(f"  ✓ {word} → {slug}.mp3")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(WORDS)} audio files...\n")
    for word in WORDS:
        await generate_audio(word)
    print(f"\nDone! Files saved to {OUTPUT_DIR}/")

if __name__ == "__main__":
    asyncio.run(main())
