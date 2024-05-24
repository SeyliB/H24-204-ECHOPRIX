import sys  # Module système pour accéder aux arguments de la ligne de commande
from transformers import pipeline  # Interface simple pour interagir avec des modèles pré-entraînés

# Récupérer le titre et la description à traduire à partir des arguments de la ligne de commande
title = sys.argv[1]
description = sys.argv[2]

# Créer un pipeline pour la traduction du français vers l'anglais
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-fr-en")

# Concaténer le titre et la description pour former un seul texte d'entrée
input_text = f"{title},{description}"

# Traduire le texte d'entrée du français vers l'anglais
translated_text = translator(input_text)

# Extraire le texte traduit en anglais
english_translated_text = translated_text[0]['translation_text']

# Créer un pipeline pour la classification "zero-shot"
classifier = pipeline("zero-shot-classification")

# Classer le texte traduit dans une catégorie prédéfinie
res = classifier(
    translated_text[0]['translation_text'],
    candidate_labels=[
        "Video Games", "Cars", "Vegetation", "Home Appliances", "Fashion Accessories", 
        "Sports Equipment", "Art Supplies", "Books", "Pet Supplies", "Furniture", 
        "Electronics", "Jewelry", "Toys", "Health & Beauty Products", "Kitchenware", 
        "Outdoor Gear", "Musical Instruments", "Fitness Equipment", "Tools & Hardware", 
        "Office Supplies"
    ]
)

# Imprimer la catégorie prédite (le résultat sera capturé par Node.js)
print(res["labels"][0])
