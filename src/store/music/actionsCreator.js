import types from './types'
import { fromJS } from 'immutable'

const sagas = {
    changeList(list, index) {
        return {
            type: types.SAGA_LIST,
            value: {
                list,
                index
            }
        }
    },

    addSongs(ids, source = { name: '其它' }) {
        return {
            type: types.SAGA_ADD_SONGS,
            value: [Array.isArray(ids) ? ids : [ids], source]
        }
    },

    changeMode() {
        return {
            type: types.SAGA_CHANGE_MODE,
        }
    }
}

const creator = {
    addCannotPlayList() {
        return {
            type: types.ADD_CANNOT_PLAT_LISTC
        }
    },

    changeIndex(index) {
        return {
            type: types.CHANGE_IDNEX,
            value: index,
        }
    },

    changePercent(percent) {
        return {
            type: types.CHANGE_PERCENT,
            value: percent
        }
    },

    changeVolume(value) {
        return {
            type: types.CHANGE_VOLUME,
            value,
        }
    },

    togglePlaying(bool) {
        return {
            type: types.TOGGLE_PLAYING,
            value: bool
        }
    },

    toggleLoading(bool) {
        return {
            type: types.TOGGLE_LOADING,
            value: bool,
        }
    },

    nextSong() {
        return {
            type: types.NEXT_SONG
        }
    },
    previousSong() {
        return {
            type: types.PREVIOUS_SONG
        }
    },
    changeBuffer(value) {
        return {
            type: types.CHANGE_BUFFER,
            value,
        }
    }
}

export const assist = {
    togglePlaying: creator.togglePlaying,
    changeIndex: creator.changeIndex,

    updateUrls(id, url) {
        return {
            type: types.UPDATE_URLS,
            value: [id, url]
        }
    },
    changeList(list) {
        return {
            type: types.CHANGE_LIST,
            value: fromJS(list)
        }
    },
    changePlaylist(list_imm) {
        return {
            type: types.CHANGE_PLAYLIST,
            value: fromJS(list_imm)
        }
    },
    changeRandomList(list) {
        return {
            type: types.CHANGE_RANDOM_LIST,
            value: fromJS(list)
        }
    },
    invalidSong(id) {
        return {
            type: types.INVALID_SONG,
            value: id
        }
    },

    addSongs(obj) {
        return {
            type: types.ADD_SONGS,
            value: fromJS(obj)
        }
    },
    changeMode(mode) {
        return {
            type: types.CHANGE_MODE,
            value: fromJS(mode)
        }
    },
}

export default Object.assign(creator, sagas)

