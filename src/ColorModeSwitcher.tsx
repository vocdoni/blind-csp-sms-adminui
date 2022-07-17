import * as React from 'react'
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = `Switch to ${useColorModeValue('dark', 'light')} mode`
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon)

  return (
    <IconButton
      size='sm'
      fontSize='lg'
      variant='ghost'
      color='current'
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      alignSelf='end'
      aria-label={text}
      title={text}
      {...props}
    />
  )
}
