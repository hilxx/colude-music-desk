/* eslint-disable react/prop-types */
import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import styles from './style'
import { connect } from 'react-redux'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useClick from 'hooks/useClick'
import { _percentConfig, _volumePercentConfig } from './config'
import { _mediaIcons } from 'config/icons'
import { computeClockMin } from 'tools/media'
import { actionsCreator as musicAc } from 'store/music'
import { actionsCreator as layoutAc } from 'store/layout'

import Progress from 'base-ui/progress'

let _silenceAgo = 0    /* 静音恢复 */
function Footer(props) {
    const
        { themeName, playing, volume, playPercent, playLoading, buffer } = props,
        {
            togglePlaying, changePercent, changeVolume,
            changePlayMode, nextSong, previousSong,
            changeSongPlaylistShow,
        } = props,
        { playMode_imm, currentSong_imm, songPlaylist_imm } = props,
        currentSong = useMemo(() => currentSong_imm.toJS(), [currentSong_imm]),
        playMode = useMemo(() => playMode_imm.toJS(), [playMode_imm]),
        { ref: songPlaylistRef, show: songPlaylistShow }
            = useMemo(() => songPlaylist_imm.toJS(), [songPlaylist_imm]),
        isInit = useRef(true),
        theme = useTheme(themeName),
        showToast = useToast(1200),
        [listener, closeListener] = useClick((bool) => {
            changeSongPlaylistShow(bool)
        }, [songPlaylistRef]),
        endTime = useMemo(() => computeClockMin(currentSong.dt), [currentSong]),
        currentTime = useMemo(() => computeClockMin(currentSong.dt * playPercent), [currentSong, playPercent]),
        silenceHandle = useCallback((e) => {
            /* 点击音量图标 */
            if (volume) {
                _silenceAgo = volume
                changeVolume(0)
            } else changeVolume(_silenceAgo)
        }, [volume, changeVolume]),
        changingPlayProgressHandle = useCallback(bool => {
            if (bool) changeVolume(_silenceAgo)
            else {
                _silenceAgo = volume
                changeVolume(0)
            }
        }, [changeVolume, volume]),
        playControlClassName = useMemo(() =>
            `${theme.fontColor_r4} ${theme}`, [theme])

    useEffect(() => {
        if (!isInit.current) showToast(playMode.name)
    }, [playMode, showToast, isInit])

    // 打开playlist
    useEffect(() => {
        if (songPlaylistShow) listener()
        else closeListener()
        return () => closeListener()
    }, [listener, closeListener, songPlaylistShow])

    useEffect(() => {
        isInit.current = false
    }, [])

    return (
        <footer className={`${styles.wrap} ${theme.back_r3} ${theme.border_v1} ${theme.fontColor_v1}`}>
            <section className={styles.playControl}>
                <span
                    onClick={previousSong}
                    className={`${_mediaIcons.previous.className} ${playControlClassName}`}
                    dangerouslySetInnerHTML={{ __html: _mediaIcons.previous.icon }}
                ></span>
                <span
                    onClick={e => togglePlaying()}
                    className={`${_mediaIcons.control.className} ${playControlClassName}`}
                    dangerouslySetInnerHTML={{ __html: _mediaIcons.control.icon(playing) }}
                ></span>
                <span
                    onClick={nextSong}
                    className={`${_mediaIcons.next.className} ${playControlClassName}`}
                    dangerouslySetInnerHTML={{ __html: _mediaIcons.next.icon }}
                ></span>
            </section>
            <section
                className={`${styles.progress} pointer`}
                style={_percentConfig.style}
            >
                <span>{currentTime}</span>
                <div className={styles.container}>
                    <Progress
                        onChange={changePercent}
                        value={playPercent}
                        loading={playLoading}
                        buffer={buffer}
                        onChanging={changingPlayProgressHandle}
                    />
                </div>
                <span>{endTime}</span>
            </section>

            {/* 音量 */}
            <section
                className={styles.progress}
                style={_volumePercentConfig.style}
            >
                <span
                    onClick={silenceHandle}
                    className={`${_mediaIcons.volume.className} `}
                    dangerouslySetInnerHTML={{ __html: _mediaIcons.volume.icon }}></span>
                <div className={styles.container}>
                    <Progress onChange={changeVolume} pointer={false} value={volume} />
                </div>

            </section>

            <span
                className={`${_mediaIcons.volume.className} ${styles.miniIcons}`}
                dangerouslySetInnerHTML={{ __html: playMode.icon }}
                onClick={changePlayMode}
            ></span>

            <span
                onClick={e => changeSongPlaylistShow(true)}
                className={`${_mediaIcons.playlist.className} ${styles.miniIcons}`}
                dangerouslySetInnerHTML={{ __html: _mediaIcons.playlist.icon }}
            ></span>
        </footer>
    )
}

const
    mapState = state => {
        const
            themeName = state.getIn(['theme', 'name']),
            music = state.get('music'),
            playing = music.get('playing'),
            playPercent = music.get('percent'),
            playLoading = music.get('loading'),
            songList_imm = music.get('list'),
            volume = music.get('volume'),
            buffer = music.get('buffer'),
            playMode_imm = music.get('mode'),
            currentSong_imm = music.get('currentSong')

        return {
            themeName,
            playPercent,
            playing,
            volume,
            playLoading,
            buffer,

            playMode_imm,
            songList_imm,
            currentSong_imm,
            songPlaylist_imm: state.getIn(['layout', 'songPlaylist']),

        }
    },
    mapDispatch = dispatch => ({
        togglePlaying(bool) {
            dispatch(musicAc.togglePlaying(bool))
        },
        changePercent(percent) {
            dispatch(musicAc.changePercent(percent))
        },
        changeVolume(volume) {
            dispatch(musicAc.changeVolume(volume))
        },
        changePlayMode() {
            dispatch(musicAc.changeMode())
        },
        nextSong() {
            dispatch(musicAc.nextSong())
        },
        previousSong() {
            dispatch(musicAc.previousSong())
        },
        changeIndex(index) {
            dispatch(musicAc.changeIndex(index))
        },
        changeSongPlaylistShow(bool) {
            dispatch(layoutAc.changeSongPlaylistShow(bool))
        }
    })

export default connect(mapState, mapDispatch)(memo(Footer))