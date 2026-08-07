import { IdentifyResult } from '../types';

export const VAULT_PRESETS: IdentifyResult[] = [
  {
    song: {
      id: 'time-hans-zimmer',
      title: 'Time',
      artist: 'Hans Zimmer',
      album: 'Inception (Original Motion Picture Soundtrack)',
      releaseYear: 2010,
      genre: 'Cinematic Orchestral / Ambient',
      spotifySearchUrl: 'https://open.spotify.com/search/Hans%20Zimmer%20Time%20Inception',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Hans+Zimmer+Time+Inception+Soundtrack',
      appleMusicSearchUrl: 'https://music.apple.com/us/search?term=Hans+Zimmer+Time+Inception'
    },
    primaryMovie: {
      id: 'inception-2010',
      movieTitle: 'Inception',
      releaseYear: 2010,
      director: 'Christopher Nolan',
      genre: 'Sci-Fi / Mind-Bending Thriller',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      sceneDescription: 'Plays during the emotional resolution sequence as Cobb wakes up on the airplane, passes through U.S. customs, and finally reunites with his children at home while spinning the brass totem.',
      timestamp: '02:18:45',
      sceneMood: 'Cathartic, Bittersweet, Transcendent',
      characterContext: 'Cobb (Leonardo DiCaprio) finally lets go of Mal and achieves peace with his family.',
      isThemeSong: true,
      isEndCredits: true,
      imdbOrWikiUrl: 'https://www.imdb.com/title/tt1375666/',
      trivia: 'Hans Zimmer built the rhythm of "Time" as a heavily slowed down, transposed motif derived from Édith Piaf\'s "Non, je ne regrette rien".',
      otherMoviesFeaturedIn: ['Inception Trailers', 'Dunkirk Featurette']
    },
    otherMovieMatches: [],
    matchConfidence: 99,
    musicCharacteristics: 'Slow building brass swell, repeated piano arpeggio, emotional string crescendo',
    identificationTip: 'Iconic 4-chord progression swelling into a massive brass & string orchestra'
  },
  {
    song: {
      id: 'where-is-my-mind',
      title: 'Where Is My Mind?',
      artist: 'Pixies',
      album: 'Surfer Rosa',
      releaseYear: 1988,
      genre: 'Alternative Rock / Indie',
      spotifySearchUrl: 'https://open.spotify.com/search/Where%20Is%20My%20Mind%20Pixies',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Where+Is+My+Mind+Pixies+Fight+Club',
      appleMusicSearchUrl: 'https://music.apple.com/us/search?term=Where+Is+My+Mind+Pixies'
    },
    primaryMovie: {
      id: 'fight-club-1999',
      movieTitle: 'Fight Club',
      releaseYear: 1999,
      director: 'David Fincher',
      genre: 'Psychological Drama / Satire',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      sceneDescription: 'The Narrator holds hands with Marla Singer at the window of a high-rise office as credit card financial towers implode outside across the city skyline.',
      timestamp: '02:13:10',
      sceneMood: 'Anarchic, Surreal, Poignant',
      characterContext: 'The Narrator tells Marla: "You met me at a very strange time in my life."',
      isThemeSong: false,
      isEndCredits: true,
      imdbOrWikiUrl: 'https://www.imdb.com/title/tt0137523/',
      trivia: 'David Fincher personally picked this song to close the film because the haunting pitch-shifting "Ooooh" vocals echoed the narrator\'s surreal detachment.',
      otherMoviesFeaturedIn: ['Mr. Robot (TV Series)', 'The Leftovers (TV Series)', 'Sucker Punch', 'Observance']
    },
    otherMovieMatches: [
      {
        id: 'sucker-punch-2011',
        movieTitle: 'Sucker Punch',
        releaseYear: 2011,
        director: 'Zack Snyder',
        genre: 'Action / Fantasy',
        posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
        sceneDescription: 'Yoav & Emily Browning acoustic cover featured in key fantasy battle sequence.',
        timestamp: '00:42:15',
        sceneMood: 'Gothic Fantasy',
        characterContext: 'Babydoll enters alternate reality fantasy battle.',
        isThemeSong: false,
        isEndCredits: false,
        imdbOrWikiUrl: 'https://www.imdb.com/title/tt0978764/',
        trivia: 'Covered specifically for the movie soundtrack by Emily Browning.'
      }
    ],
    matchConfidence: 98,
    musicCharacteristics: 'Ethereal falsetto backing vocal "Oooh", crunchy acoustic guitar riff, driving bassline',
    identificationTip: 'The unmistakable "Oooh... stop!" falsetto opening lead'
  },
  {
    song: {
      id: 'a-real-hero',
      title: 'A Real Hero',
      artist: 'College & Electric Youth',
      album: 'Drive (Original Motion Picture Soundtrack)',
      releaseYear: 2011,
      genre: 'Synthwave / Electronic / Dream Pop',
      spotifySearchUrl: 'https://open.spotify.com/search/A%20Real%20Hero%20College%20Electric%20Youth',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=A+Real+Hero+College+Drive+Soundtrack',
      appleMusicSearchUrl: 'https://music.apple.com/us/search?term=A+Real+Hero+College'
    },
    primaryMovie: {
      id: 'drive-2011',
      movieTitle: 'Drive',
      releaseYear: 2011,
      director: 'Nicolas Winding Refn',
      genre: 'Neo-Noir / Action Thriller',
      posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
      sceneDescription: 'The Driver (Ryan Gosling) drives Irene and her young son Benicio through the sun-drenched concrete river canal of Los Angeles in his 1973 Chevrolet Chevelle Malibu.',
      timestamp: '00:31:05',
      sceneMood: 'Dreamy, Tender, Nostalgic',
      characterContext: 'The Driver experiences a rare moment of pure tenderness and family connection.',
      isThemeSong: true,
      isEndCredits: true,
      imdbOrWikiUrl: 'https://www.imdb.com/title/tt0780504/',
      trivia: 'The song lyrics "A real human being and a real hero" were inspired by Captain Chesley "Sully" Sullenberger landing US Airways Flight 1549 on the Hudson River.',
      otherMoviesFeaturedIn: ['Drive (Main Theme)']
    },
    otherMovieMatches: [],
    matchConfidence: 97,
    musicCharacteristics: 'Analog 80s synthesizer pads, soft electro drum machine beat, serene female vocals',
    identificationTip: 'Classic neon-lit synthwave ballad'
  },
  {
    song: {
      id: 'hooked-on-a-feeling',
      title: 'Hooked on a Feeling',
      artist: 'Blue Swede',
      album: 'Hooked on a Feeling',
      releaseYear: 1974,
      genre: 'Pop Rock / Classic 70s',
      spotifySearchUrl: 'https://open.spotify.com/search/Hooked%20on%20a%20Feeling%20Blue%20Swede',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Hooked+on+a+Feeling+Guardians+of+the+Galaxy',
      appleMusicSearchUrl: 'https://music.apple.com/us/search?term=Hooked+on+a+Feeling+Blue+Swede'
    },
    primaryMovie: {
      id: 'guardians-galaxy-2014',
      movieTitle: 'Guardians of the Galaxy',
      releaseYear: 2014,
      director: 'James Gunn',
      genre: 'Sci-Fi / Space Opera / Comedy',
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      sceneDescription: 'Peter Quill (Star-Lord) gets processed into the Kyln high-security space prison and desperately tries to reclaim his Sony Walkman cassette tape from a Nova Corps guard.',
      timestamp: '00:22:40',
      sceneMood: 'Exuberant, Irreverent, Nostalgic',
      characterContext: 'Quill gets tased by prison guards for protecting his prized "Awesome Mix Vol. 1".',
      isThemeSong: false,
      isEndCredits: false,
      imdbOrWikiUrl: 'https://www.imdb.com/title/tt2015381/',
      trivia: 'Sales of Blue Swede\'s 1974 single surged by over 700% the week after the Guardians of the Galaxy teaser trailer was released.',
      otherMoviesFeaturedIn: ['Reservoir Dogs (1992)']
    },
    otherMovieMatches: [
      {
        id: 'reservoir-dogs-1992',
        movieTitle: 'Reservoir Dogs',
        releaseYear: 1992,
        director: 'Quentin Tarantino',
        genre: 'Crime / Drama',
        posterUrl: 'https://images.unsplash.com/photo-1518676599625-5d2f623255ef?q=80&w=800&auto=format&fit=crop',
        sceneDescription: 'Featured on the "K-Billy\'s Super Sounds of the 70s" radio broadcast in the warehouse.',
        timestamp: '00:48:10',
        sceneMood: 'Tense 70s Radio Vibe',
        characterContext: 'K-Billy radio background music.',
        isThemeSong: false,
        isEndCredits: false,
        imdbOrWikiUrl: 'https://www.imdb.com/title/tt0105236/',
        trivia: 'One of the signature tracks of K-Billy\'s radio show in Tarantino\'s debut film.'
      }
    ],
    matchConfidence: 99,
    musicCharacteristics: 'Ooga-chaka ooga-ooga chant intro, brass fanfare, upbeat pop rhythm',
    identificationTip: 'The iconic "Ooga-Chaka Ooga-Ooga" vocal chant intro'
  },
  {
    song: {
      id: 'sunflower-post-malone',
      title: 'Sunflower',
      artist: 'Post Malone & Swae Lee',
      album: 'Hollywood\'s Bleeding / Spider-Man: Into the Spider-Verse',
      releaseYear: 2018,
      genre: 'Pop / Hip-Hop / R&B',
      spotifySearchUrl: 'https://open.spotify.com/search/Sunflower%20Post%20Malone%20Swae%20Lee',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Sunflower+Post+Malone+Spider-Verse',
      appleMusicSearchUrl: 'https://music.apple.com/us/search?term=Sunflower+Post+Malone'
    },
    primaryMovie: {
      id: 'spider-verse-2018',
      movieTitle: 'Spider-Man: Into the Spider-Verse',
      releaseYear: 2018,
      director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
      genre: 'Animated Superhero / Action',
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
      sceneDescription: 'Miles Morales sits in his dorm room wearing headphones, off-key humming along to the lyrics while sketching stickers in his notebook before sneaking out to spray paint.',
      timestamp: '00:06:15',
      sceneMood: 'Playful, Relatable, Youthful',
      characterContext: 'Miles Morales trying to settle into his new elite prep school life.',
      isThemeSong: true,
      isEndCredits: false,
      imdbOrWikiUrl: 'https://www.imdb.com/title/tt4633694/',
      trivia: 'Miles deliberately sings the wrong words ("Callin\' it quits now, baby I\'m a wreck") because he hasn\'t fully learned the lyrics yet, making him feel human and authentic.',
      otherMoviesFeaturedIn: ['Spider-Man: Across the Spider-Verse (Callback)']
    },
    otherMovieMatches: [],
    matchConfidence: 99,
    musicCharacteristics: 'Melodic vocal harmomies, chiming synth bell chords, smooth trap-influenced rhythm',
    identificationTip: 'Swae Lee\'s falsetto "Ayy, ayy, ayy, ayy (Ooh)" opening hook'
  },
  {
    song: {
      id: 'misirlou-dick-dale',
      title: 'Misirlou',
      artist: 'Dick Dale & His Del-Tones',
      album: 'Surfer\'s Choice',
      releaseYear: 1962,
      genre: 'Surf Rock / Instrumental',
      spotifySearchUrl: 'https://open.spotify.com/search/Misirlou%20Dick%20Dale',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Misirlou+Dick+Dale+Pulp+Fiction',
      appleMusicSearchUrl: 'https://music.apple.com/us/search?term=Misirlou+Dick+Dale'
    },
    primaryMovie: {
      id: 'pulp-fiction-1994',
      movieTitle: 'Pulp Fiction',
      releaseYear: 1994,
      director: 'Quentin Tarantino',
      genre: 'Crime / Non-Linear Noir',
      posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
      sceneDescription: 'Fades in immediately after Pumpkin (Tim Roth) and Honey Bunny shout "Any of you fucking pricks move, and I\'ll execute every motherfucking last one of ya!" slamming into the freeze-frame title screen.',
      timestamp: '00:03:00',
      sceneMood: 'Adrenaline, Explosive, Cool',
      characterContext: 'Diner robbery hold-up opening scene transition to title card.',
      isThemeSong: true,
      isEndCredits: false,
      imdbOrWikiUrl: 'https://www.imdb.com/title/tt0110912/',
      trivia: 'Tarantino chose surf music for Pulp Fiction because he felt it gave the movie a rock \'n\' roll Spaghetti Western energy.',
      otherMoviesFeaturedIn: ['Taxi (1998)', 'Space Jam (1996)', 'The Simpsons']
    },
    otherMovieMatches: [],
    matchConfidence: 99,
    musicCharacteristics: 'Rapid tremolo guitar picking, brass accent horn bursts, high speed surf beat',
    identificationTip: 'Fastest double-picked electric guitar riff in cinema history'
  }
];
