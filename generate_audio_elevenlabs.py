#!/usr/bin/env python3
"""
HADALING AUDIO GENERATOR - ElevenLabs Edition
Generates all 136 audio files with unified voice quality.

Usage:
  1. Set your ElevenLabs API key: export ELEVENLABS_API_KEY="sk_fab4339e90ea4d516e4e761ada6dc562480acba1ffc6112f"
  2. Run: python generate_audio_elevenlabs.py

Options:
  --dry-run     Show what would be generated without making API calls
  --voice       Voice ID to use (default: Rachel - clear American English)
  --list-voices List available voices and exit
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path

try:
    import requests
except ImportError:
    print("Installing requests...")
    os.system("pip install requests --break-system-packages -q")
    import requests

# ============================================================
# CONFIGURATION
# ============================================================

API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
BASE_URL = "https://api.elevenlabs.io/v1"
OUTPUT_DIR = Path("public/audio")

# Recommended voices for language learning (clear pronunciation)
VOICES = {
    "rachel": "21m00Tcm4TlvDq8ikWAM",      # Rachel - American, warm, clear
    "drew": "29vD33N1CtxCmqQRPOHJ",         # Drew - American, calm, neutral
    "clyde": "2EiwWnXFnvU5JabPnv8n",        # Clyde - American, deep
    "domi": "AZnzlk1XvdvUeBnXmlld",          # Domi - American, young
    "bella": "EXAVITQu4vr4xnSDxMaL",        # Bella - American, soft
    "elli": "MF3mGyEYCl7XYWbV9V6O",          # Elli - American, clear
    "josh": "TxGEqnHWrfWFTfGW9XjX",          # Josh - American, deep
    "arnold": "VR6AewLTigWG4xSOukaG",       # Arnold - American, crisp
    "adam": "pNInz6obpgDQGcFmaJgB",          # Adam - American, deep
    "sam": "yoZ06aMxZJJ28mfd3POQ",           # Sam - American, raspy
}

DEFAULT_VOICE = "rachel"

# Voice settings for clear language learning audio
VOICE_SETTINGS = {
    "stability": 0.75,           # Higher = more consistent
    "similarity_boost": 0.75,    # Higher = more natural
    "style": 0.0,                # 0 = neutral (best for learning)
    "use_speaker_boost": True    # Clearer pronunciation
}

# ============================================================
# AUDIO MANIFEST
# ============================================================

MANIFEST = [
    # LESSON 1: Simple introductions
    {"category": "lesson-chunks", "text": "Hi, I'm", "folder": "lessons/lesson-1", "filename": "1-a.mp3"},
    {"category": "lesson-chunks", "text": "Nice to meet you.", "folder": "lessons/lesson-1", "filename": "1-b.mp3"},
    {"category": "lesson-chunks", "text": "What's your name?", "folder": "lessons/lesson-1", "filename": "1-c.mp3"},
    {"category": "lesson-chunks", "text": "My name is", "folder": "lessons/lesson-1", "filename": "1-d.mp3"},
    {"category": "lesson-chunks", "text": "And you?", "folder": "lessons/lesson-1", "filename": "1-e.mp3"},
    {"category": "listen-exercises", "text": "My name is Hassan.", "folder": "lessons/lesson-1", "filename": "listen-5.mp3"},

    # LESSON 2: How are you?
    {"category": "lesson-chunks", "text": "How are you?", "folder": "lessons/lesson-2", "filename": "2-a.mp3"},
    {"category": "lesson-chunks", "text": "I'm fine, thanks.", "folder": "lessons/lesson-2", "filename": "2-b.mp3"},
    {"category": "lesson-chunks", "text": "I'm good.", "folder": "lessons/lesson-2", "filename": "2-c.mp3"},
    {"category": "lesson-chunks", "text": "Not bad.", "folder": "lessons/lesson-2", "filename": "2-d.mp3"},
    {"category": "lesson-chunks", "text": "And you?", "folder": "lessons/lesson-2", "filename": "2-e.mp3"},
    {"category": "listen-exercises", "text": "Not bad.", "folder": "lessons/lesson-2", "filename": "listen-5.mp3"},

    # LESSON 3: Greetings and goodbyes
    {"category": "lesson-chunks", "text": "Good morning.", "folder": "lessons/lesson-3", "filename": "3-a.mp3"},
    {"category": "lesson-chunks", "text": "Good evening.", "folder": "lessons/lesson-3", "filename": "3-b.mp3"},
    {"category": "lesson-chunks", "text": "Goodbye.", "folder": "lessons/lesson-3", "filename": "3-c.mp3"},
    {"category": "lesson-chunks", "text": "See you later.", "folder": "lessons/lesson-3", "filename": "3-d.mp3"},
    {"category": "lesson-chunks", "text": "Have a good day.", "folder": "lessons/lesson-3", "filename": "3-e.mp3"},
    {"category": "listen-exercises", "text": "Good afternoon.", "folder": "lessons/lesson-3", "filename": "listen-5.mp3"},

    # LESSON 4: Yes, no, thanks
    {"category": "lesson-chunks", "text": "Yes.", "folder": "lessons/lesson-4", "filename": "4-a.mp3"},
    {"category": "lesson-chunks", "text": "No.", "folder": "lessons/lesson-4", "filename": "4-b.mp3"},
    {"category": "lesson-chunks", "text": "Thank you.", "folder": "lessons/lesson-4", "filename": "4-c.mp3"},
    {"category": "lesson-chunks", "text": "You're welcome.", "folder": "lessons/lesson-4", "filename": "4-d.mp3"},
    {"category": "lesson-chunks", "text": "No problem.", "folder": "lessons/lesson-4", "filename": "4-e.mp3"},
    {"category": "listen-exercises", "text": "Thanks a lot.", "folder": "lessons/lesson-4", "filename": "listen-5.mp3"},

    # LESSON 5: Wants and needs
    {"category": "lesson-chunks", "text": "I want", "folder": "lessons/lesson-5", "filename": "5-a.mp3"},
    {"category": "lesson-chunks", "text": "I need", "folder": "lessons/lesson-5", "filename": "5-b.mp3"},
    {"category": "lesson-chunks", "text": "I don't want", "folder": "lessons/lesson-5", "filename": "5-c.mp3"},
    {"category": "lesson-chunks", "text": "Can I have", "folder": "lessons/lesson-5", "filename": "5-d.mp3"},
    {"category": "lesson-chunks", "text": "Please.", "folder": "lessons/lesson-5", "filename": "5-e.mp3"},
    {"category": "listen-exercises", "text": "I want water.", "folder": "lessons/lesson-5", "filename": "listen-5.mp3"},

    # LESSON 6: Shopping
    {"category": "lesson-chunks", "text": "How much?", "folder": "lessons/lesson-6", "filename": "6-a.mp3"},
    {"category": "lesson-chunks", "text": "How much is this?", "folder": "lessons/lesson-6", "filename": "6-b.mp3"},
    {"category": "lesson-chunks", "text": "That's expensive.", "folder": "lessons/lesson-6", "filename": "6-c.mp3"},
    {"category": "lesson-chunks", "text": "That's okay.", "folder": "lessons/lesson-6", "filename": "6-d.mp3"},
    {"category": "lesson-chunks", "text": "I'll take it.", "folder": "lessons/lesson-6", "filename": "6-e.mp3"},
    {"category": "listen-exercises", "text": "It's five dollars.", "folder": "lessons/lesson-6", "filename": "listen-5.mp3"},

    # LESSON 7: Work
    {"category": "lesson-chunks", "text": "What do you do?", "folder": "lessons/lesson-7", "filename": "7-a.mp3"},
    {"category": "lesson-chunks", "text": "I work as", "folder": "lessons/lesson-7", "filename": "7-b.mp3"},
    {"category": "lesson-chunks", "text": "I'm a student.", "folder": "lessons/lesson-7", "filename": "7-c.mp3"},
    {"category": "lesson-chunks", "text": "I have a business.", "folder": "lessons/lesson-7", "filename": "7-d.mp3"},
    {"category": "lesson-chunks", "text": "Where do you work?", "folder": "lessons/lesson-7", "filename": "7-e.mp3"},
    {"category": "listen-exercises", "text": "I work as a driver.", "folder": "lessons/lesson-7", "filename": "listen-5.mp3"},

    # LESSON 8: Directions
    {"category": "lesson-chunks", "text": "Where is", "folder": "lessons/lesson-8", "filename": "8-a.mp3"},
    {"category": "lesson-chunks", "text": "It's here.", "folder": "lessons/lesson-8", "filename": "8-b.mp3"},
    {"category": "lesson-chunks", "text": "It's there.", "folder": "lessons/lesson-8", "filename": "8-c.mp3"},
    {"category": "lesson-chunks", "text": "Go straight.", "folder": "lessons/lesson-8", "filename": "8-d.mp3"},
    {"category": "lesson-chunks", "text": "Turn left.", "folder": "lessons/lesson-8", "filename": "8-e.mp3"},
    {"category": "listen-exercises", "text": "Go straight.", "folder": "lessons/lesson-8", "filename": "listen-5.mp3"},

    # LESSON 9: Understanding
    {"category": "lesson-chunks", "text": "I understand.", "folder": "lessons/lesson-9", "filename": "9-a.mp3"},
    {"category": "lesson-chunks", "text": "I don't understand.", "folder": "lessons/lesson-9", "filename": "9-b.mp3"},
    {"category": "lesson-chunks", "text": "Can you repeat that?", "folder": "lessons/lesson-9", "filename": "9-c.mp3"},
    {"category": "lesson-chunks", "text": "Slowly, please.", "folder": "lessons/lesson-9", "filename": "9-d.mp3"},
    {"category": "lesson-chunks", "text": "What does that mean?", "folder": "lessons/lesson-9", "filename": "9-e.mp3"},
    {"category": "listen-exercises", "text": "Slowly, please.", "folder": "lessons/lesson-9", "filename": "listen-5.mp3"},

    # LESSON 10: Getting help
    {"category": "lesson-chunks", "text": "Can you help me?", "folder": "lessons/lesson-10", "filename": "10-a.mp3"},
    {"category": "lesson-chunks", "text": "I need help.", "folder": "lessons/lesson-10", "filename": "10-b.mp3"},
    {"category": "lesson-chunks", "text": "Excuse me.", "folder": "lessons/lesson-10", "filename": "10-c.mp3"},
    {"category": "lesson-chunks", "text": "Sorry.", "folder": "lessons/lesson-10", "filename": "10-d.mp3"},
    {"category": "lesson-chunks", "text": "No worries.", "folder": "lessons/lesson-10", "filename": "10-e.mp3"},
    {"category": "listen-exercises", "text": "Sorry.", "folder": "lessons/lesson-10", "filename": "listen-5.mp3"},

    # PRACTICE - VOCABULARY
    {"category": "practice-vocabulary", "text": "Mother", "folder": "practice/vocabulary", "filename": "mother.mp3"},
    {"category": "practice-vocabulary", "text": "Rice", "folder": "practice/vocabulary", "filename": "rice.mp3"},
    {"category": "practice-vocabulary", "text": "Red", "folder": "practice/vocabulary", "filename": "red.mp3"},
    {"category": "practice-vocabulary", "text": "Bread", "folder": "practice/vocabulary", "filename": "bread.mp3"},
    {"category": "practice-vocabulary", "text": "Green", "folder": "practice/vocabulary", "filename": "green.mp3"},
    {"category": "practice-vocabulary", "text": "Brother", "folder": "practice/vocabulary", "filename": "brother.mp3"},

    # PRACTICE - WORD FORMATION
    {"category": "practice-word-formation", "text": "mother", "folder": "practice/word-formation", "filename": "mother.mp3"},
    {"category": "practice-word-formation", "text": "teacher", "folder": "practice/word-formation", "filename": "teacher.mp3"},
    {"category": "practice-word-formation", "text": "water", "folder": "practice/word-formation", "filename": "water.mp3"},
    {"category": "practice-word-formation", "text": "school", "folder": "practice/word-formation", "filename": "school.mp3"},
    {"category": "practice-word-formation", "text": "apple", "folder": "practice/word-formation", "filename": "apple.mp3"},
    {"category": "practice-word-formation", "text": "family", "folder": "practice/word-formation", "filename": "family.mp3"},
    {"category": "practice-word-formation", "text": "friend", "folder": "practice/word-formation", "filename": "friend.mp3"},
    {"category": "practice-word-formation", "text": "hospital", "folder": "practice/word-formation", "filename": "hospital.mp3"},
    {"category": "practice-word-formation", "text": "green", "folder": "practice/word-formation", "filename": "green.mp3"},
    {"category": "practice-word-formation", "text": "children", "folder": "practice/word-formation", "filename": "children.mp3"},

    # PRACTICE - SENTENCE BUILDER
    {"category": "practice-sentence-builder", "text": "I am from Somalia.", "folder": "practice/sentence-builder", "filename": "sentence-1.mp3"},
    {"category": "practice-sentence-builder", "text": "She goes to school.", "folder": "practice/sentence-builder", "filename": "sentence-2.mp3"},
    {"category": "practice-sentence-builder", "text": "Can you help me please?", "folder": "practice/sentence-builder", "filename": "sentence-3.mp3"},
    {"category": "practice-sentence-builder", "text": "I want water.", "folder": "practice/sentence-builder", "filename": "sentence-4.mp3"},
    {"category": "practice-sentence-builder", "text": "My name is Ahmed.", "folder": "practice/sentence-builder", "filename": "sentence-5.mp3"},
    {"category": "practice-sentence-builder", "text": "I work as a teacher.", "folder": "practice/sentence-builder", "filename": "sentence-6.mp3"},
    {"category": "practice-sentence-builder", "text": "He is happy.", "folder": "practice/sentence-builder", "filename": "sentence-7.mp3"},
    {"category": "practice-sentence-builder", "text": "The children are playing.", "folder": "practice/sentence-builder", "filename": "sentence-8.mp3"},
    {"category": "practice-sentence-builder", "text": "I love you.", "folder": "practice/sentence-builder", "filename": "sentence-9.mp3"},
    {"category": "practice-sentence-builder", "text": "Where are you from?", "folder": "practice/sentence-builder", "filename": "sentence-10.mp3"},

    # WORD OF THE DAY (50 words)
    {"category": "wotd", "text": "Hello", "folder": "wotd", "filename": "hello.mp3"},
    {"category": "wotd", "text": "Goodbye", "folder": "wotd", "filename": "goodbye.mp3"},
    {"category": "wotd", "text": "Thank you", "folder": "wotd", "filename": "thank-you.mp3"},
    {"category": "wotd", "text": "Please", "folder": "wotd", "filename": "please.mp3"},
    {"category": "wotd", "text": "Sorry", "folder": "wotd", "filename": "sorry.mp3"},
    {"category": "wotd", "text": "Welcome", "folder": "wotd", "filename": "welcome.mp3"},
    {"category": "wotd", "text": "Good morning", "folder": "wotd", "filename": "good-morning.mp3"},
    {"category": "wotd", "text": "Good night", "folder": "wotd", "filename": "good-night.mp3"},
    {"category": "wotd", "text": "How are you?", "folder": "wotd", "filename": "how-are-you.mp3"},
    {"category": "wotd", "text": "I am fine", "folder": "wotd", "filename": "i-am-fine.mp3"},
    {"category": "wotd", "text": "Nice to meet you", "folder": "wotd", "filename": "nice-to-meet-you.mp3"},
    {"category": "wotd", "text": "See you later", "folder": "wotd", "filename": "see-you-later.mp3"},
    {"category": "wotd", "text": "Happy", "folder": "wotd", "filename": "happy.mp3"},
    {"category": "wotd", "text": "Sad", "folder": "wotd", "filename": "sad.mp3"},
    {"category": "wotd", "text": "Angry", "folder": "wotd", "filename": "angry.mp3"},
    {"category": "wotd", "text": "Tired", "folder": "wotd", "filename": "tired.mp3"},
    {"category": "wotd", "text": "Excited", "folder": "wotd", "filename": "excited.mp3"},
    {"category": "wotd", "text": "Scared", "folder": "wotd", "filename": "scared.mp3"},
    {"category": "wotd", "text": "Worried", "folder": "wotd", "filename": "worried.mp3"},
    {"category": "wotd", "text": "Surprised", "folder": "wotd", "filename": "surprised.mp3"},
    {"category": "wotd", "text": "Proud", "folder": "wotd", "filename": "proud.mp3"},
    {"category": "wotd", "text": "Nervous", "folder": "wotd", "filename": "nervous.mp3"},
    {"category": "wotd", "text": "Calm", "folder": "wotd", "filename": "calm.mp3"},
    {"category": "wotd", "text": "Confused", "folder": "wotd", "filename": "confused.mp3"},
    {"category": "wotd", "text": "Lonely", "folder": "wotd", "filename": "lonely.mp3"},
    {"category": "wotd", "text": "Teacher", "folder": "wotd", "filename": "teacher.mp3"},
    {"category": "wotd", "text": "Student", "folder": "wotd", "filename": "student.mp3"},
    {"category": "wotd", "text": "Book", "folder": "wotd", "filename": "book.mp3"},
    {"category": "wotd", "text": "Pen", "folder": "wotd", "filename": "pen.mp3"},
    {"category": "wotd", "text": "School", "folder": "wotd", "filename": "school.mp3"},
    {"category": "wotd", "text": "Office", "folder": "wotd", "filename": "office.mp3"},
    {"category": "wotd", "text": "Computer", "folder": "wotd", "filename": "computer.mp3"},
    {"category": "wotd", "text": "Meeting", "folder": "wotd", "filename": "meeting.mp3"},
    {"category": "wotd", "text": "Homework", "folder": "wotd", "filename": "homework.mp3"},
    {"category": "wotd", "text": "Exam", "folder": "wotd", "filename": "exam.mp3"},
    {"category": "wotd", "text": "Boss", "folder": "wotd", "filename": "boss.mp3"},
    {"category": "wotd", "text": "Job", "folder": "wotd", "filename": "job.mp3"},
    {"category": "wotd", "text": "Colleague", "folder": "wotd", "filename": "colleague.mp3"},
    {"category": "wotd", "text": "Car", "folder": "wotd", "filename": "car.mp3"},
    {"category": "wotd", "text": "Bus", "folder": "wotd", "filename": "bus.mp3"},
    {"category": "wotd", "text": "Airplane", "folder": "wotd", "filename": "airplane.mp3"},
    {"category": "wotd", "text": "Train", "folder": "wotd", "filename": "train.mp3"},
    {"category": "wotd", "text": "Bicycle", "folder": "wotd", "filename": "bicycle.mp3"},
    {"category": "wotd", "text": "Boat", "folder": "wotd", "filename": "boat.mp3"},
    {"category": "wotd", "text": "Taxi", "folder": "wotd", "filename": "taxi.mp3"},
    {"category": "wotd", "text": "Road", "folder": "wotd", "filename": "road.mp3"},
    {"category": "wotd", "text": "Airport", "folder": "wotd", "filename": "airport.mp3"},
    {"category": "wotd", "text": "Ticket", "folder": "wotd", "filename": "ticket.mp3"},
    {"category": "wotd", "text": "Driver", "folder": "wotd", "filename": "driver.mp3"},
    {"category": "wotd", "text": "Walk", "folder": "wotd", "filename": "walk.mp3"},
]

# ============================================================
# FUNCTIONS
# ============================================================

def list_voices():
    """List available ElevenLabs voices"""
    if not API_KEY:
        print("Error: Set ELEVENLABS_API_KEY environment variable")
        sys.exit(1)

    response = requests.get(
        f"{BASE_URL}/voices",
        headers={"xi-api-key": API_KEY}
    )

    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        sys.exit(1)

    voices = response.json().get("voices", [])
    print(f"\n{'='*60}")
    print("AVAILABLE ELEVENLABS VOICES")
    print(f"{'='*60}\n")

    for voice in voices:
        labels = voice.get("labels", {})
        accent = labels.get("accent", "Unknown")
        gender = labels.get("gender", "Unknown")
        print(f"  {voice['name']:<20} {voice['voice_id']}")
        print(f"  {'':20} {gender}, {accent}")
        print()

def generate_audio(text, output_path, voice_id, dry_run=False):
    """Generate audio for a single text using ElevenLabs"""

    if dry_run:
        print(f"  [DRY RUN] Would generate: {output_path}")
        return True

    output_path.parent.mkdir(parents=True, exist_ok=True)

    response = requests.post(
        f"{BASE_URL}/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "text": text,
            "model_id": "eleven_flash_v2_5",
            "voice_settings": VOICE_SETTINGS
        }
    )

    if response.status_code != 200:
        print(f"  ✗ Error: {response.status_code} - {response.text[:100]}")
        return False

    with open(output_path, "wb") as f:
        f.write(response.content)

    return True

def main():
    parser = argparse.ArgumentParser(description="Generate Hadaling audio with ElevenLabs")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be generated")
    parser.add_argument("--voice", default=DEFAULT_VOICE, help=f"Voice to use (default: {DEFAULT_VOICE})")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    parser.add_argument("--skip-existing", action="store_true", help="Skip files that already exist")
    args = parser.parse_args()

    if args.list_voices:
        list_voices()
        return

    if not API_KEY and not args.dry_run:
        print("Error: Set ELEVENLABS_API_KEY environment variable")
        print("  export ELEVENLABS_API_KEY='your-api-key'")
        sys.exit(1)

    voice_id = VOICES.get(args.voice.lower(), args.voice)

    print(f"\n{'='*60}")
    print("HADALING AUDIO GENERATOR - ElevenLabs")
    print(f"{'='*60}")
    print(f"\n  Voice: {args.voice} ({voice_id})")
    print(f"  Total files: {len(MANIFEST)}")
    print(f"  Output: {OUTPUT_DIR}/")
    if args.dry_run:
        print(f"  Mode: DRY RUN (no API calls)")
    print()

    by_category = {}
    for item in MANIFEST:
        cat = item["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(item)

    success = 0
    skipped = 0
    failed = 0

    for category, items in by_category.items():
        print(f"\n{category.upper()} ({len(items)} files)")
        print("-" * 40)

        for item in items:
            output_path = OUTPUT_DIR / item["folder"] / item["filename"]

            if args.skip_existing and output_path.exists():
                print(f"  ⊘ {item['filename']} (exists, skipping)")
                skipped += 1
                continue

            print(f"  → {item['text'][:40]:<40} → {item['filename']}")

            if generate_audio(item["text"], output_path, voice_id, args.dry_run):
                success += 1
            else:
                failed += 1

            if not args.dry_run:
                time.sleep(0.5)

    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    print(f"  ✓ Generated: {success}")
    print(f"  ⊘ Skipped:   {skipped}")
    print(f"  ✗ Failed:    {failed}")
    print(f"  Total:       {success + skipped + failed}")
    print()

if __name__ == "__main__":
    main()
