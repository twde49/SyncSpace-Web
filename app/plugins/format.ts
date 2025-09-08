/**
 * Nuxt plugin providing date formatting and time difference utilities.
 *
 * @returns Provides `formatDate` and `timeDifference` functions for use throughout the app.
 */
export default defineNuxtPlugin(() => {
  /**
   * Formats a date string according to the specified format.
   * Supported tokens: yyyy, MM, dd, HH, mm, ss.
   * @param dateString - The date string to format.
   * @param dateFormat - The format string (default: "yyyy-MM-dd").
   * @returns Formatted date string or original if invalid.
   */
  const formatDate = (dateString: string, dateFormat = 'yyyy-MM-dd') => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)

      const pad = (n: number) => (n < 10 ? `0${n}` : n)

      const year = date.getFullYear()
      const month = pad(date.getMonth() + 1)
      const day = pad(date.getDate())
      const hours = pad(date.getHours())
      const minutes = pad(date.getMinutes())
      const seconds = pad(date.getSeconds())

      return dateFormat
        .replace('yyyy', String(year))
        .replace('MM', <string>month)
        .replace('dd', <string>day)
        .replace('HH', <string>hours)
        .replace('mm', <string>minutes)
        .replace('ss', <string>seconds)
    } catch (error) {
      console.error('Chaîne de date invalide:', error)
      return dateString
    }
  }

  /**
   * Calculates the time difference between now and a given date string.
   * Returns the difference in days, hours, minutes, or seconds.
   * @param dateString - The date string to compare.
   * @returns Human-readable time difference string.
   */
  const timeDifference = (dateString: string) => {
    if (!dateString) return ''

    try {
      const now = new Date()
      const targetDate = new Date(dateString)

      const differenceInMilliseconds = now.getTime() - targetDate.getTime()
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
      const differenceInMinutes = Math.floor(differenceInSeconds / 60)
      const differenceInHours = Math.floor(differenceInMinutes / 60)
      const differenceInDays = Math.floor(differenceInHours / 24)

      if (differenceInDays > 0) return `${differenceInDays} j`
      if (differenceInHours > 0) return `${differenceInHours} h`
      if (differenceInMinutes > 0) return `${differenceInMinutes} min`
      return `${differenceInSeconds} sec`
    } catch (error) {
      console.error('Chaîne de date invalide:', error)
      return ''
    }
  }

  return {
    provide: {
      formatDate,
      timeDifference,
    },
  }
})
