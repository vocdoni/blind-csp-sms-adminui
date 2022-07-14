import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  initialColorMode: 'system',
  layerStyles: {
    codedark: {
      bg: 'gray.800',
    },
    codelight: {
      bg: 'gray.50',
    }
  },
})

export default theme
