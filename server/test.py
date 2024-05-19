import pytesseract
from PIL import Image
import re

print(pytesseract.image_to_string(Image.open('./Untitled.png')))