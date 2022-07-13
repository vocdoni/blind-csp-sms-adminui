import { Box, HStack, Link, Tag, Text } from '@chakra-ui/react'
import { Election } from '../types'

const ElectionRow = ({election}: {election: Election}) => {
  const consumedColor = election.consumed ? 'pink' : 'green'
  const remainingColor = election.remainingAttempts > 0 ? 'green' : 'pink'

  return (
    <Box>
      <Text w='full' textOverflow='ellipsis' overflow='hidden' whiteSpace='pre'>
        <Link
          title={election.electionId}
          href={`https://dev.explorer.vote/processes/show/#/${election.electionId}`}
          target='_blank'
        >
          {election.electionId}
        </Link>
      </Text>
      <HStack w='full' alignItems='stretch'>
        <Tag colorScheme={remainingColor}>
          {election.remainingAttempts} remaining attempts
        </Tag>
        <Tag colorScheme={consumedColor}>
          {election.consumed ? 'consumed' : 'not consumed'}
        </Tag>
      </HStack>
    </Box>
  )
}

export default ElectionRow
