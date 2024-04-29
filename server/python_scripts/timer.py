import sys
from datetime import datetime, timezone

def calculate_hours_difference(post_timestamp):
    try:
        # Parse the timestamp string into a datetime object (assuming it's in UTC)
        post_date = datetime.fromisoformat(post_timestamp).replace(tzinfo=timezone.utc)
    except ValueError:
        print(f"Error: Invalid timestamp format '{post_timestamp}'.")
        sys.exit(1)

    # Get the current datetime in UTC
    current_date = datetime.now(timezone.utc)

    # Calculate the time difference in hours
    time_difference = current_date - post_date
    hours_difference = int(time_difference.total_seconds() / 3600)

    return hours_difference

def format_time_ago(timestamp):
    try:
        # Parse the timestamp string into a datetime object (assuming it's in UTC)
        post_date = datetime.fromisoformat(timestamp).replace(tzinfo=timezone.utc)
    except ValueError:
        return "Invalid timestamp"

    # Get the current datetime in UTC
    current_date = datetime.now(timezone.utc)

    # Calculate the time difference in seconds
    time_difference = current_date - post_date
    seconds_difference = int(time_difference.total_seconds())
    minutes_difference = seconds_difference // 60
    hours_difference = minutes_difference // 60
    days_difference = hours_difference // 24
    months_difference = current_date.month - post_date.month + (current_date.year - post_date.year) * 12
    years_difference = current_date.year - post_date.year

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

# Example usage:
timestamp = '2024-04-29T18:04:30.782+00:00'
formatted_time_ago = format_time_ago(timestamp)
print(formatted_time_ago)  # Output: "2 years ago"
