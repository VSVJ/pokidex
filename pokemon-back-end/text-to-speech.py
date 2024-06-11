import sys
import openai
import os
from pathlib import Path
from pydub import AudioSegment
import simpleaudio as sa
from openai import OpenAI
os.environ["OPENAI_API_KEY"] = "ur key"
client = OpenAI()

# Get the argument passed from the Node.js application
generated_text = sys.argv[1]

# Function to convert text to speech using OpenAI's TTS
def text_to_speech(text, output_file_path):
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text
    )
    response.stream_to_file(output_file_path)

# Function to play the audio file
def play_audio(file_path):
    audio = AudioSegment.from_mp3(file_path)
    playback = sa.play_buffer(
        audio.raw_data,
        num_channels=audio.channels,
        bytes_per_sample=audio.sample_width,
        sample_rate=audio.frame_rate
    )
    playback.wait_done()


output_file_path = Path(__file__).parent / "output.mp3"



# Convert the generated text to speech and save it as an MP3 file
text_to_speech(generated_text, output_file_path)

# Play the audio file
play_audio(output_file_path)