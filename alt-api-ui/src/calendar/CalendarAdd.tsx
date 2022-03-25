import { faAdd, faCopy, faDownload, faWarning } from '@fortawesome/free-solid-svg-icons'
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
import ky from 'ky'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { GroupDatalist } from '../datalists/GroupDatalist'
import { baseUrl } from '../util'

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
            'Generated URL is over 256 chars, some web calendars may issues processing that long URL!'
          }
        >
          <Text color={'warning'}>
            <FontAwesomeIcon icon={faWarning} />
          </Text>
        </Tooltip>
      )}
      <Grid.Container gap={2}>
        <Grid>
          <Button
            icon={<FontAwesomeIcon icon={faCopy} />}
            auto
            onClick={() => navigator.clipboard.writeText(icsUrl.toString())}
          >
            Copy ICS URL
          </Button>
        </Grid>
        <Grid>
          <Link href={icsUrl.toString()}>
            <Button icon={<FontAwesomeIcon icon={faDownload} />} auto>
              Download ICS
            </Button>
          </Link>
        </Grid>
      </Grid.Container>
    </>
  )
}

export function CalendarAdd() {
  const [groups, setGroups] = useState<string[]>([])
  const [groupSearch, setGroupSearch] = useState<string>('')

  return (
    <>
      <Text h4>Select groups</Text>
      <Grid.Container alignItems={'flex-end'} gap={2}>
        <Grid>
          <Input
            clearable
            bordered
            label="Group name"
            placeholder="WIs I.2 - 1w"
            css={{ width: '320px' }}
            onChange={(e) => setGroupSearch(e.target.value)}
            list={'groupsAvailable'}
          />
          <GroupDatalist id={'groupsAvailable'} />
        </Grid>
        <Grid>
          <Button
            auto
            icon={<FontAwesomeIcon icon={faAdd} />}
            onClick={() => setGroups([...groups, groupSearch])}
          >
            Add
          </Button>
        </Grid>
      </Grid.Container>
      <CalendarUrl groups={groups} />
      <Grid.Container gap={2}>
        <Grid>
          {groups.map((group) => (
            <div key={group}>
              <Checkbox
                onChange={() => setGroups(groups.filter((g) => group !== g))}
                checked={true}
              >
                {group}
              </Checkbox>
            </div>
          ))}
        </Grid>
      </Grid.Container>
    </>
  )
}
