import pandas as pd
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
mangas = pd.read_csv('manga_db.csv')

condition = (mangas['tags'] == '[]') | (mangas['genres'] == '[]')
manga_filtered = mangas[~condition]
mangas = manga_filtered

mangas = mangas.dropna()
cleaned_mangas = mangas.drop_duplicates()
cleaned_mangas.to_csv('formatted_manga_db.csv', index=False)

def create_cosine_similarity(manga_db):
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(manga_db['tags'])

    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    np.save('cosine-similarity.npy', cosine_sim)

create_cosine_similarity(cleaned_mangas)