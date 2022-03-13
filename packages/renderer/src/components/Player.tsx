import { Fragment } from 'react'
import ArtistInline from '@/components/ArtistsInline'
import IconButton from '@/components/IconButton'
import Slider from '@/components/Slider'
import SvgIcon from '@/components/SvgIcon'
import { player } from '@/store'
import { resizeImage } from '@/utils/common'
import { State as PlayerState } from '@/utils/player'

const PlayingTrack = () => {
  const navigate = useNavigate()
  const snappedPlayer = useSnapshot(player)
  const track = useMemo(() => snappedPlayer.track, [snappedPlayer.track])
  const trackListSource = useMemo(
    () => snappedPlayer.trackListSource,
    [snappedPlayer.trackListSource]
  )

  const toAlbum = () => {
    const id = track?.al?.id
    if (id) navigate(`/album/${id}`)
  }

  const toTrackListSource = () => {
    if (trackListSource?.type)
      navigate(`/${trackListSource.type}/${trackListSource.id}`)
  }

  return (
    <Fragment>
      {track && (
        <div className="flex items-center gap-3">
          {track?.al?.picUrl && (
            <img
              onClick={toAlbum}
              className="aspect-square h-full rounded-md shadow-md"
              src={resizeImage(track?.al?.picUrl ?? '', 'sm')}
            />
          )}
          {!track?.al?.picUrl && (
            <div
              onClick={toAlbum}
              className="flex aspect-square h-full items-center justify-center rounded-md bg-black/[.04] shadow-sm"
            >
              <SvgIcon className="h-6 w-6 text-gray-300" name="music-note" />
            </div>
          )}

          <div className="flex flex-col justify-center leading-tight">
            <div
              onClick={toTrackListSource}
              className="line-clamp-1 font-semibold text-black decoration-gray-600 decoration-2 hover:underline dark:text-white"
            >
              {track?.name}
            </div>
            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              <ArtistInline artists={track?.ar ?? []} />
            </div>
          </div>

          <IconButton>
            <SvgIcon
              className="h-4 w-4 text-black dark:text-white"
              name="heart-outline"
            />
          </IconButton>
        </div>
      )}
      {!track && <div></div>}
    </Fragment>
  )
}

const MediaControls = () => {
  const playerSnapshot = useSnapshot(player)
  const state = useMemo(() => playerSnapshot.state, [playerSnapshot.state])
  const track = useMemo(() => playerSnapshot.track, [playerSnapshot.track])
  return (
    <div className="flex items-center justify-center gap-2 text-black dark:text-white">
      <IconButton onClick={() => track && player.prevTrack()} disabled={!track}>
        <SvgIcon className="h-4 w-4" name="previous" />
      </IconButton>
      <IconButton
        onClick={() => track && player.playOrPause()}
        disabled={!track}
        className="rounded-2xl"
      >
        <SvgIcon
          className="h-[1.5rem] w-[1.5rem] "
          name={state === PlayerState.PLAYING ? 'pause' : 'play'}
        />
      </IconButton>
      <IconButton onClick={() => track && player.nextTrack()} disabled={!track}>
        <SvgIcon className="h-4 w-4" name="next" />
      </IconButton>
    </div>
  )
}

const Others = () => {
  return (
    <div className="flex items-center justify-end gap-2 pr-2 text-black dark:text-white">
      <IconButton>
        <SvgIcon className="h-4 w-4" name="playlist" />
      </IconButton>
      <IconButton>
        <SvgIcon className="h-4 w-4" name="repeat" />
      </IconButton>
      <IconButton>
        <SvgIcon className="h-4 w-4" name="shuffle" />
      </IconButton>
      <IconButton>
        <SvgIcon className="h-4 w-4" name="volume" />
      </IconButton>
      <IconButton>
        <SvgIcon className="h-4 w-4" name="chevron-up" />
      </IconButton>
    </div>
  )
}

const Progress = () => {
  const playerSnapshot = useSnapshot(player)
  const progress = useMemo(
    () => playerSnapshot.progress,
    [playerSnapshot.progress]
  )
  const track = useMemo(() => playerSnapshot.track, [playerSnapshot.track])

  return (
    <div className="absolute w-screen">
      {track && (
        <Slider
          min={0}
          max={(track.dt ?? 0) / 1000}
          value={progress}
          onChange={value => {
            player.progress = value
          }}
          onlyCallOnChangeAfterDragEnded={true}
        />
      )}
      {!track && (
        <div className="absolute h-[2px] w-full bg-gray-500 bg-opacity-10"></div>
      )}
    </div>
  )
}

const Player = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 grid h-16 grid-cols-3 grid-rows-1 bg-white bg-opacity-[.86] py-2.5 px-5 backdrop-blur-xl backdrop-saturate-[1.8] dark:bg-[#222]">
      <Progress />

      <PlayingTrack />
      <MediaControls />
      <Others />
    </div>
  )
}

export default Player