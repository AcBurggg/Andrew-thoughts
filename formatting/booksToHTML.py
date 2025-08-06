import csv
import sys

def generate_book_card_html(title, author, genres, rating, description):
    genre_divs = '\n'.join(f'    <div class="book-genre">{genre.strip()}</div>' for genre in genres)
    genre_attr = genres[0].strip() if genres else ''
    html = f'''<div class="book-card" data-genre="{genre_attr.lower()}" data-author="{author}" data-rating="{rating}">
    <div class="book-title">{title}</div>
    <div class="book-author">{author}</div>
{genre_divs}
    <div class="book-rating">Rating: {rating}/5</div>
    <p>{description}</p>
</div>'''
    return html

def process_csv(file_path):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        html_blocks = []
        for row in reader:
            if len(row) < 5:
                continue  # Skip incomplete rows
            title, author, genre_str, rating, description = row
            genres = genre_str.split('|')  # Split multiple genres
            html_blocks.append(generate_book_card_html(title, author, genres, rating, description))
        return '\n\n'.join(html_blocks)

# === Run the script ===
if __name__ == "__main__":
    input_csv = sys.argv[1]
    html_output = process_csv(input_csv)
    print(html_output)
