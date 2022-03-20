import { faCopy, faDownload, faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Checkbox,
  Grid,
  Input,
  Link,
  Loading,
  Spacer,
  Text,
  Tooltip,
} from '@nextui-org/react'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

type CalendarUrlProps = {
  groups: string[]
}

function CalendarUrl({ groups }: CalendarUrlProps) {
  const icsUrl = useMemo(() => {
    const url = new URL(baseUrl)
    url.pathname = '/v1/timetable/index.ics'
    for (const group of groups) {
      url.searchParams.append('groups', group)
    }
    return url
  }, [groups])

  if (groups.length < 1)
    return (
      <Text css={{ opacity: 0.8 }} color={'error'}>
        Select at least one group
      </Text>
    )

  return (
    <>
      {icsUrl.toString().length > 256 && (
        <Tooltip
          content={
            'Generated URL is over 256 chars, some calendars may issues processing that long URL!'
          }
        >
          <Text color={'warning'}>
            <FontAwesomeIcon icon={faWarning} />
          </Text>
        </Tooltip>
      )}
      <Button
        icon={<FontAwesomeIcon icon={faCopy} />}
        auto
        onClick={() => navigator.clipboard.writeText(icsUrl.toString())}
      >
        Copy ICS URL
      </Button>
      <Spacer />
      <Link href={icsUrl.toString()}>
        <Button icon={<FontAwesomeIcon icon={faDownload} />} auto>
          Download ICS
        </Button>
      </Link>
    </>
  )
}

const getAvailableGroups: () => Promise<{ groupsAvailable: string[] }> = () =>
  fetch(`${baseUrl}v1/timetable/groups`).then((r) => r.json())

export function CalendarAdd() {
  const qResponse = useQuery('groups', getAvailableGroups)
  const { data, isLoading, isError } = qResponse
  const { groupsAvailable } = data ?? { groupsAvailable: [] }

  const [groups, setGroups] = useState<string[]>([])
  const [groupSearch, setGroupSearch] = useState<string>('')
  const groupsFiltered = useMemo(
    () =>
      groupsAvailable
        .filter((group) => !groups.includes(group))
        .filter((group) => group.toLowerCase().includes(groupSearch.toLowerCase()))
        .sort(),
    [groups, groupsAvailable, groupSearch],
  )

  if (isError)
    return (
      <Text color={'error'} as={'pre'}>
        {isError}
      </Text>
    )
  if (isLoading) return <Loading />
  console.log(groups)

  return (
    <>
      <Text h4>Select groups</Text>
      <Grid.Container gap={2}>
        <Grid>
          <Input
            clearable
            underlined
            label="Group name"
            placeholder="WIs I.2 - 1w"
            onChange={(e) => setGroupSearch(e.target.value)}
          />
          <Spacer />
          <CalendarUrl groups={groups} />
          <Spacer />
          {groups.map((group) => (
            <p key={group}>
              <Checkbox
                onChange={() => setGroups(groups.filter((g) => group !== g))}
                checked={true}
              >
                {group}
              </Checkbox>
            </p>
          ))}
        </Grid>
        <Grid css={{ overflow: 'auto', maxHeight: (33.25 + 16) * 10 }}>
          {groupsFiltered.slice(0, 50).map((group) => (
            <p key={group}>
              <Checkbox onChange={() => setGroups([...groups, group])} checked={false}>
                {group}
              </Checkbox>
            </p>
          ))}
          {groupsFiltered.length > 50 && (
            <Text i>And {groupsFiltered.length - 50} more...</Text>
          )}
        </Grid>
      </Grid.Container>
    </>
  )
}
