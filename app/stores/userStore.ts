import { defineStore } from 'pinia'
import Cookies from 'universal-cookie'
import type { Track } from '~/types/Track'

/**
 * Pinia store for managing user state, authentication, and preferences.
 * Includes actions for setting user data, managing cookies, and handling current track.
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    token: '',
    masterPasswordSet: false,
    currentTrack: null as Track | null,
    socketId: '',
    parameters: {
      theme: '',
      modulesLayout: [] as string[],
      notificationsEnabled: true,
      geolocationEnabled: true,
    },
  }),
  actions: {
    /**
     * Sets user data and stores it in cookies.
     * @param data - User data object.
     */
    setUser(data: {
      firstName: string
      lastName: string
      email: string
      token: string
      masterPasswordSet: boolean
      currentTrack: Track
      parameters: {
        theme: string
        modulesLayout: string[]
        notificationsEnabled: boolean
        geolocationEnabled: boolean
      }
    }) {
      this.firstName = data.firstName
      this.lastName = data.lastName
      this.email = data.email
      this.token = data.token
      this.masterPasswordSet = data.masterPasswordSet
      this.parameters = {
        theme: data.parameters.theme,
        modulesLayout: data.parameters.modulesLayout,
        notificationsEnabled: data.parameters.notificationsEnabled,
        geolocationEnabled: data.parameters.geolocationEnabled,
      }
      this.currentTrack = data.currentTrack ?? null

      const cookies = new Cookies()
      cookies.set('user', JSON.stringify(data), {
        path: '/',
        maxAge: 60 * 60 * 24 * 31,
        sameSite: 'strict',
        httpOnly: false,
      })
    },

    /**
     * Sets the user's socket ID.
     * @param socketId - The socket ID to set.
     */
    setSocketId(socketId: string) {
      this.socketId = socketId
    },

    /**
     * Sets the current track for the user.
     * @param trackData - Track data object.
     */
    setCurrentTrack(trackData: Track) {
      this.currentTrack = trackData
    },

    /**
     * Returns the current user object if authenticated.
     * @returns User object or null.
     */
    currentUser() {
      if (this.token === '' || this.email === '' || this.firstName === '' || this.lastName === '') {
        return null
      }
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        token: this.token,
        masterPasswordSet: this.masterPasswordSet,
        theme: this.parameters.theme,
        modulesLayout: this.parameters.modulesLayout,
        notificationsEnabled: this.parameters.notificationsEnabled,
        currentTrack: this.currentTrack,
      }
    },

    /**
     * Loads user data from cookies into the store.
     */
    loadUserFromCookies() {
      const cookies = new Cookies()
      const userData = cookies.get('user')

      if (userData) {
        try {
          this.firstName = userData.firstName
          this.lastName = userData.lastName
          this.email = userData.email
          this.token = userData.token
          this.masterPasswordSet = userData.masterPasswordSet
          this.parameters.theme = userData.parameters.theme
          this.parameters.modulesLayout = userData.parameters.modulesLayout
          this.parameters.notificationsEnabled = userData.parameters.notificationsEnabled
          this.currentTrack = userData.currentTrack || null
        } catch (e) {
          console.error('Failed to parse user data from cookies:', e)
        }
      }
    },

    /**
     * Logs out the user and clears cookies and state.
     */
    logout() {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.token = ''
      this.masterPasswordSet = false
      this.parameters.theme = ''
      this.parameters.modulesLayout = []
      this.parameters.notificationsEnabled = false
      this.currentTrack = null

      const cookies = new Cookies()
      cookies.remove('user', { path: '/' })
    },
  },
})
