import sys
from datetime import datetime, timezone

# Fonction pour calculer la différence en heures entre l'horodatage de la publication et l'heure actuelle
def calculate_hours_difference(post_timestamp):
    try:
        # Convertir l'horodatage de la publication en objet datetime (en supposant qu'il est en UTC)
        post_date = datetime.fromisoformat(post_timestamp).replace(tzinfo=timezone.utc)
    except ValueError:
        print(f"Erreur : Format d'horodatage invalide '{post_timestamp}'.")
        sys.exit(1)

    # Obtenir la date et l'heure actuelles en UTC
    current_date = datetime.now(timezone.utc)

    # Calculer la différence de temps en secondes
    time_difference = current_date - post_date
    hours_difference = int(time_difference.total_seconds() / 3600)

    return hours_difference

# Fonction pour formater la différence de temps depuis la publication de manière conviviale
def format_time_ago(timestamp):
    try:
        # Convertir l'horodatage de la publication en objet datetime (en supposant qu'il est en UTC)
        post_date = datetime.fromisoformat(timestamp).replace(tzinfo=timezone.utc)
    except ValueError:
        return "Horodatage invalide"

    # Obtenir la date et l'heure actuelles en UTC
    current_date = datetime.now(timezone.utc)

    # Calculer la différence de temps en secondes
    time_difference = current_date - post_date
    seconds_difference = int(time_difference.total_seconds())
    minutes_difference = seconds_difference // 60
    hours_difference = minutes_difference // 60
    days_difference = hours_difference // 24
    months_difference = current_date.month - post_date.month + (current_date.year - post_date.year) * 12
    years_difference = current_date.year - post_date.year

    # Formater la différence de temps en fonction de sa magnitude
    if seconds_difference < 60:
        return f"{seconds_difference} second{'s' if seconds_difference != 1 else ''} ago"
    elif minutes_difference < 60:
        return f"{minutes_difference} minute{'s' if minutes_difference != 1 else ''} ago"
    elif hours_difference < 24:
        return f"{hours_difference} hour{'s' if hours_difference != 1 else ''} ago"
    elif days_difference < 30:
        return f"{days_difference} day{'s' if days_difference != 1 else ''} ago"
    elif months_difference < 12:
        return f"{months_difference} month{'s' if months_difference != 1 else ''} ago"
    else:
        return f"{years_difference} year{'s' if years_difference != 1 else ''} ago"

# Exemple d'utilisation des fonctions
timestamp = sys.argv[1]
# Calculer la différence en heures depuis la publication
hours_difference = calculate_hours_difference(timestamp)
print(f"Heures écoulées depuis la publication : {hours_difference} heures")

# Formater et afficher la différence de temps depuis la publication de manière conviviale
formatted_time_ago = format_time_ago(timestamp)
print(f"Depuis la publication : {formatted_time_ago}")
