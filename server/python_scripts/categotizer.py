import sys
from transformers import pipeline

# Retrieve the title from command line argument
title = sys.argv[1]
description = sys.argv[2]




translator = pipeline("translation", model="Helsinki-NLP/opus-mt-fr-en")

input_text = f"{title},{description}"

translated_text = translator(input_text)

english_translated_text = translated_text[0]['translation_text']


classifier = pipeline("zero-shot-classification")
 
res = classifier(
    translated_text[0]['translation_text'],
    candidate_labels=["Video Games", "Cars", "Vegetation", "Home Appliances", "Fashion Accessories", "Sports Equipment", "Art Supplies", "Books", "Pet Supplies", "Furniture", "Electronics", "Jewelry", "Toys", "Health & Beauty Products", "Kitchenware", "Outdoor Gear", "Musical Instruments", "Fitness Equipment", "Tools & Hardware", "Office Supplies"],
# "Jeux vidéo", "Voitures", "Végétation", "Appareils électroménagers", "Accessoires de mode", "Équipement de sport", "Fournitures d'art", "Livres", "Fournitures pour animaux de compagnie", "Meubles", "Électronique", "Bijoux", "Jouets", "Produits de santé et de beauté", "Articles de cuisine", "Équipement extérieur", "Instruments de musique", "Équipement de fitness", "Outils et quincaillerie", "Fournitures de bureau"
)

# Print the processed data (output will be captured by Node.js)
print(res["labels"][0])


