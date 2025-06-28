export interface MediaItem {
  id: string | number
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
  type: 'series' | 'movie'
}

export async function searchTheTVDB(query: string): Promise<MediaItem[]> {
  try {
    const tokenRes = await fetch('http://localhost:3002/api/thetvdb/token')
    const { token } = await tokenRes.json()

    const searchRes = await fetch(
      `https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    const data = await searchRes.json()

    console.log('TheTVDB search data:', data)

    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    return data.data
      .filter((item: any) => item?.objectID && item?.name)
      .map((item: any) => ({
        id: item.objectID,
        title: item.name,
        rating: item.score?.toFixed(1) ?? '7.9',
        imageSrc: item.image_url || '/images/placeholder.jpg',
        year: item.firstAired?.split('-')[1] ?? '2025',
        type: item.objectType === 'movie' ? 'movie' : 'series',
      }))
  } catch (error) {
    console.error('Error en searchTheTVDB:', error)
    return []
  }
}

export async function getShowDetails(id: string, type: 'series' | 'movie' = 'series'): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3002/api/content/${type}/${id}`)
    if (!res.ok) {
      throw new Error('No encontrado en backend')
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error al obtener detalles del show:', error)
    return null
  }
}

export async function batchSearchTheTVDBExact(titles: string[]): Promise<MediaItem[]> {
  try {
    const tokenRes = await fetch('http://localhost:3002/api/thetvdb/token')
    const { token } = await tokenRes.json()

    const fetches = titles.map((title) =>
      fetch(`https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(title)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const first = data.data?.[0]
          return first
            ? {
                id: first.objectID,
                title: first.name,
                rating: first.score?.toFixed(1) ?? '7.9',
                imageSrc: first.image_url || '/images/placeholder.jpg',
                year: first.firstAired?.split('-')[0] ?? '2025',
                type: first.objectType === 'movie' ? 'movie' : 'series',
              }
            : null
        })
        .catch((err) => {
          console.warn(`Error al buscar "${title}":`, err)
          return null
        }),
    )

    const results = await Promise.all(fetches)
    return results.filter((item): item is MediaItem => item !== null)
  } catch (error) {
    console.error('Error en la busqueda:', error)
    return []
  }
}
