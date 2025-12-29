import ast
import datetime

import requests
from flask import *
import pandas as pd
import numpy as np
from flask_cors import CORS
import create_cosine

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

mangas = pd.read_csv('formatted_manga_db.csv')

indices = pd.Series(mangas['title'], index=mangas.index,).drop_duplicates()

query = '''
    query (
      $page: Int
      $id: Int
      $isAdult: Boolean
      $search: String
      $format: [MediaFormat]
      $status: MediaStatus
      $countryOfOrigin: CountryCode
      $source: MediaSource
      $season: MediaSeason
      $seasonYear: Int
      $year: String
      $today: FuzzyDateInt
      $onList: Boolean
      $yearLesser: FuzzyDateInt
      $yearGreater: FuzzyDateInt
      $episodeLesser: Int
      $episodeGreater: Int
      $durationLesser: Int
      $durationGreater: Int
      $chapterLesser: Int
      $chapterGreater: Int
      $volumeLesser: Int
      $volumeGreater: Int
      $licensedBy: [Int]
      $isLicensed: Boolean
      $genres: [String]
      $excludedGenres: [String]
      $tags: [String]
      $excludedTags: [String]
      $minimumTagRank: Int
      $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
    ) {
      Page(page: $page, perPage: 100) {
        pageInfo {
          hasNextPage
          total
        }
        media(
          id: $id
          type: MANGA
          season: $season
          format_in: $format
          status: $status
          countryOfOrigin: $countryOfOrigin
          source: $source
          search: $search
          onList: $onList
          seasonYear: $seasonYear
          startDate: $today
          startDate_like: $year
          startDate_lesser: $yearLesser
          startDate_greater: $yearGreater
          episodes_lesser: $episodeLesser
          episodes_greater: $episodeGreater
          duration_lesser: $durationLesser
          duration_greater: $durationGreater
          chapters_lesser: $chapterLesser
          chapters_greater: $chapterGreater
          volumes_lesser: $volumeLesser
          volumes_greater: $volumeGreater
          licensedById_in: $licensedBy
          isLicensed: $isLicensed
          genre_in: $genres
          genre_not_in: $excludedGenres
          tag_in: $tags
          tag_not_in: $excludedTags
          minimumTagRank: $minimumTagRank
          sort: $sort
          isAdult: $isAdult
        ) {
          id
          title {
            english
            romaji
            native
          }
          status
          countryOfOrigin
          genres
          tags {
            name
          }
          coverImage{
            large
          }

        }
      }
    }
    '''

def get_recommendation(title):
    def find_idx(manga_title):
        for index, item in indices.items():
            if manga_title in item:
                return index
        return -1
    try:
        cosine_sim = np.load('cosine-similarity.npy')
        manga_index = find_idx(title)
        if manga_index == -1:
            return "Manga Not Found."
        sin_scrs = enumerate(cosine_sim[manga_index])
        sin_scrs = sorted(sin_scrs, key=lambda x: x[1], reverse=True)
        for val in sin_scrs:
          if val[1] < np.float64(0.02):
            sin_scrs.remove(val)
        sin_scrs = sin_scrs[:300]
        sin_idx = [score[0] for score in sin_scrs]
        rec_mangas_db = pd.merge(mangas,mangas['title'].iloc[sin_idx], how="right")
        return rec_mangas_db
    except KeyError:
        return "Manga Not Found."

@app.route("/find_recs/<string:title>", methods=["GET"])
def send_recs(title):
    recommendations = get_recommendation(title)
    if type(recommendations) == str:
        return jsonify(recommendations), 200
    else:
        recs = recommendations.to_dict(orient='records')
        for rec in recs:
            rec['title'] = ast.literal_eval(rec['title'])
            rec['genres'] = ast.literal_eval(rec['genres'])
            rec['tags'] = ast.literal_eval(rec['tags'])
        return jsonify(recs[:300]), 200

@app.route("/latest_recs", methods=["GET"])
def add_latest_recs():
    url = 'https://graphql.anilist.co'
    variables = {
        "today": datetime.datetime.today().strftime('%Y%m%d'),
    }
    response = requests.post(url, json={'query': query, 'variables': variables})
    data = response.json()['data']['Page']
    mangas = data['media']
    adjusted_list = []
    for manga in mangas:
        manga_dict = {
            'id': manga['id'],
            'title': list(manga['title'].values()),
            'status': manga['status'],
            'countryOfOrigin': manga['countryOfOrigin'],
            'genres': manga['genres'],
            'tags': [tag['name'] for tag in manga['tags']],
            'image': manga['coverImage']['large'],
        }
        adjusted_list.append(manga_dict)
    df = pd.DataFrame(adjusted_list)
    mangas = pd.read_csv('formatted_manga_db.csv')
    new_df = pd.concat([mangas, df], ignore_index=True)
    new_df.to_csv('formatted_manga_db.csv', index=False)
    create_cosine.create_cosine_similarity(new_df)
    return

if __name__ == "__main__":
    app.run(debug=True)
