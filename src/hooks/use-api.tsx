import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useContext, useEffect } from 'react'
import { useRef } from 'react'
import { createContext, ReactNode, RefObject } from 'react'
import { ApiBaseReset, ApiBaseSet, ApiState, ApiStateEmpty, ApiTokenReset, ApiTokenSet, useApiReducer } from './use-api-reducer'

export const ApiContext = createContext<ApiState>(ApiStateEmpty)

export const ApiProvider = ({children}: {children: ReactNode}) => {
  const [api, dispatch] = useApiReducer()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const toast = useToast()

  const dump = async () => {
    try {
      const { data } = await api.client.get('/dump')
      if (typeof data !== 'object') {
        throw new Error('Unknown data received')
      }

      // create fake element to run file download
      const json = encodeURIComponent(JSON.stringify(data, null, 2))
      const elem = document.createElement('a')
      elem.style.display = 'none'
      elem.setAttribute('href', 'data:application/json;charset=utf-8,' + json)
      elem.setAttribute('download', `csp-sms-dump-${(new Date()).getTime()}.json`)
      document.body.appendChild(elem)

      elem.click()
      document.body.removeChild(elem)
    } catch (e) {
      toast({
        status: 'error',
        title: 'Could not dump DB',
        description: 'Check console for details',
      })
      console.error('Could not dump DB:', e)
    }
  }

  const saveBase = (baseRef: RefObject<HTMLInputElement>) => {
    if (!baseRef.current) {
      return
    }

    const base = baseRef.current.value
    if (!base.length) {
      dispatch({type: ApiBaseReset})
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      axios.get(`${base}/ping`)
        .then(({data}) => {
          if (data !== '.\n') {
            throw new Error('Pong not received')
          }
          dispatch({type: ApiBaseSet, payload: base})
          toast({
            status: 'success',
            title: 'API base seems valid',
          })
        })
        .catch((e) => {
          dispatch({type: ApiBaseReset})
          toast({
            status: 'error',
            title: 'Invalid API base',
          })
          console.warn(e)
        })
    }, 500)
  }

  const saveToken = (tokenRef: RefObject<HTMLInputElement>) => {
    if (!tokenRef.current) {
      return
    }

    if (!tokenRef.current.value.length) {
      dispatch({type: ApiTokenReset})
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      axios.get(`${api.base.url}/users`, {
        headers: {
          Authorization: `Bearer ${tokenRef.current?.value}`
        }
      }).then(() => {
        dispatch({
          type: ApiTokenSet,
          payload: tokenRef.current?.value as string,
        })
        toast({
          status: 'success',
          title: 'Token is valid',
        })
      })
      .catch(() => {
        dispatch({type: ApiTokenReset})
        toast({
          status: 'error',
          title: 'Invalid token',
        })
      })
    }, 500)
  }

  // Ask before closing in case there's a token stored in state
  const exitHandler = (e: BeforeUnloadEvent) => e.preventDefault()
  useEffect(() => {
    if (!api.token.valid) return

    window.addEventListener('beforeunload', exitHandler, {capture: true})
    return () => {
      window.removeEventListener('beforeunload', exitHandler, {capture: true})
    }
  }, [api.token.valid])

  const value = {
    ...api,
    dump,
    saveBase,
    saveToken,
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}


export const useApi = () => {
  const api = useContext(ApiContext)

  if (!api) {
    throw new Error('useApi() must be used inside an <ApiProvider /> declaration')
  }

  return api
}
