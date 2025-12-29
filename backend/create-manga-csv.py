import datetime
import time

import requests
import pandas as pd
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

url = 'https://graphql.anilist.co'
manga_list = []

for i in range(1, 1001):
    response = requests.post(url, json={'query': query, 'variables': {'page': i}})
    data = response.json()['data']['Page']
    mangas = data['media']
    for manga in mangas:
        manga_list.append(manga)
    time.sleep(2)

adjusted_list = []
for manga in manga_list:
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
df.to_csv('manga_db.csv', index=False)
