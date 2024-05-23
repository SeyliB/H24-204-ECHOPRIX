@echo off

python -m venv venv
.\venv\Scripts\activate


pip install transformers
pip install torch torchvision torchaudio

pause >nul
