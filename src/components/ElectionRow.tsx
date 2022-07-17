import { Stack, Link, Tag, Text } from '@chakra-ui/react'
import { EXPLORER } from '@constants'
import { Election } from '@localtypes'
import ElectionActions from './ElectionActions'

const ElectionRow = ({election}: {election: Election}) => {
  const consumedColor = election.consumed ? 'pink' : 'green'
  const remainingColor = election.remainingAttempts > 0 ? 'green' : 'pink'

  return (
    <Stack direction='row'>
      <Stack direction='column' maxW='calc(var(--chakra-sizes-full) - var(--chakra-sizes-12))'>
        <Text textOverflow='ellipsis' overflow='hidden' whiteSpace='pre'>
          <Link
            title={election.electionId}
            href={`${EXPLORER}/processes/show/#/${election.electionId}`}
            target='_blank'
          >
            {election.electionId}
          </Link>
        </Text>
        <Stack direction='row' alignItems='stretch'>
          <Tag colorScheme={remainingColor}>
            {election.remainingAttempts} remaining attempts
          </Tag>
          <Tag colorScheme={consumedColor}>
            {election.consumed ? 'consumed' : 'not consumed'}
          </Tag>
        </Stack>
      </Stack>
      <ElectionActions election={election} />
    </Stack>
  )
}

export default ElectionRow
