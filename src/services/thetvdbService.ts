export interface MediaItem {
  id: string | number
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
  type: 'series' | 'movie'
}

// Servicio para interactuar con la API de TheTVDB

/**
 * Busca contenido (películas o series) en TheTVDB según el texto recibido.
 * @param query Texto a buscar (nombre de la serie o película)
 * @returns Resultados de la búsqueda
 */
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
        id:
          typeof item.objectID === 'string' && item.objectID.includes('-')
            ? item.objectID.split('-').pop()
            : item.objectID,
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

/**
 * Obtiene detalles de una película o serie específica desde TheTVDB.
 * @param id ID del contenido
 * @param type Tipo de contenido ('movie' o 'series')
 * @returns Detalles del contenido
 */
export async function getShowDetails(
  id: string,
  type: 'series' | 'movie' = 'series',
): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3002/api/content/${type}/${id}`)
    if (!res.ok) {
      throw new Error('No encontrado en backend')
    }
    const data = await res.json()
    const image_url = data.image_url || data.image || '/images/placeholder.jpg'
    const genres = data.genres?.map((g: any) => g.name) || []
    const creators = data.people?.directors?.map((d: any) => d.name) || []
    //Normalizamos los datos de entrada para poder mostrarlos
    return {
      id: data.id,
      name: data.name,
      overview: data.overview || 'Sin descripción disponible',
      genres: genres.length ? genres : ['Drama', 'Sci-Fi'],
      status: data.status?.name || 'Released',
      runtime: data.runtime || data.averageRuntime || '??',
      firstAired: data.firstAired || '2025-01-01',
      year: data.year ? String(data.year) : '2025',
      image_url,
      imdb_id: data.remoteIds?.find((r: any) => r.sourceName === 'imdb')?.id ?? null,
      siteRating: '7.9', //Quemado ya que la API no cuenta con info acerca de los ratings para el contenido en general
      creators,
    }
  } catch (error) {
    console.error('Error al obtener detalles del show:', error)
    return null
  }
}

/**
 * Realiza una búsqueda exacta de varios títulos en TheTVDB.
 * @param titles Array de títulos a buscar
 * @returns Array de resultados exactos
 */
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
                id:
                  typeof first.objectID === 'string' && first.objectID.includes('-')
                    ? first.objectID.split('-').pop()
                    : first.objectID,
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
