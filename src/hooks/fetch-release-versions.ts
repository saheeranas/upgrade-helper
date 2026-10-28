import { useEffect, useState } from 'react'
import { getReleasesFileURL } from '../utils'

export const useFetchReleaseVersions = ({
  packageName,
}: {
  packageName: string
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [releaseVersions, setReleaseVersions] = useState<string[]>([])

  useEffect(() => {
    const fetchReleaseVersions = async () => {
      setIsLoading(true)
      setIsDone(false)
      try {
        const response = await fetch(getReleasesFileURL({ packageName }), {
          signal: AbortSignal.timeout(3000),
        })
        const releaseVersions = (await response.text())
          .split('\n')
          .filter(Boolean)
        setReleaseVersions(releaseVersions)
      } catch (error) {
        if (error instanceof Error) {
          console.log(error?.name)
        }
      } finally {
        setIsLoading(false)
        setIsDone(true)
      }
      if (releaseVersions.length) return
      setIsLoading(true)
      setIsDone(false)

      try {
        const response = await fetch('upgrade-helper/RN_RELEASES.txt')
        const releaseVersions = (await response.text())
          .split('\n')
          .filter(Boolean)
        setReleaseVersions(releaseVersions)
      } catch (error) {
        console.error('error in fetching static file')
      } finally {
        setIsLoading(false)
        setIsDone(true)
      }
      return
    }

    fetchReleaseVersions()
  }, [packageName])

  return {
    isLoading,
    isDone,
    releaseVersions,
  }
}
