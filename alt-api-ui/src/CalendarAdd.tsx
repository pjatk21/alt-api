import { faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Grid, Input, Link, Loading, Spacer, Text } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import useSWR from "swr";

const baseUrl = import.meta.env.DEV
? 'http://krystians-mac-pro.local:4000'
: 'https://altapi.kpostek.dev'

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
  
  if (groups.length < 2) return <Button auto disabled color={"error"}>Select at least 2 groups</Button>
  
  return (<>
    <Button icon={<FontAwesomeIcon icon={faCopy} />} auto onClick={() => navigator.clipboard.writeText(icsUrl.toString())}>Copy ICS URL</Button>
    <Spacer />
    <Link href={icsUrl.toString()}>
      <Button icon={<FontAwesomeIcon icon={faDownload} />} auto>Download ICS</Button>
    </Link>
  </>)
}

export function CalendarAdd() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const url = new URL(baseUrl)
  url.pathname = '/v1/timetable/groups'

  const availableGroupsResponse = useSWR(url.toString(), fetcher)

  const { groupsAvailable } = (availableGroupsResponse.data ?? { groupsAvailable: [] }) as { groupsAvailable: string[] }
  const [groups, setGroups] = useState<string[]>([])
  const [groupSearch, setGroupSearch] = useState<string>("")
  const groupsFiltered = useMemo(
    () => groupsAvailable.filter((group) => !groups.includes(group)).filter((group) => group.toLowerCase().includes(groupSearch.toLowerCase())).sort(),
    [groups, groupsAvailable, groupSearch]
  )
  
  if (availableGroupsResponse.error) <Text>{availableGroupsResponse.error}</Text>
  if (!availableGroupsResponse.data) return <Loading />

  return (
    <>
      <Text h4>Select groups</Text>
      <Grid.Container gap={2}>
        <Grid>
          <Input width="260px" clearable bordered label="Group name" placeholder="WIs I.2 - 1w" onChange={(e) => setGroupSearch(e.target.value)}/>
          <Spacer />
          <CalendarUrl groups={groups} />
          <Spacer />
          {groups.map((group) => <p key={group}><Checkbox onChange={(e) => setGroups(groups.filter((g) => group !== g)) } checked={true}>{group}</Checkbox></p>)}
        </Grid>
        <Grid>
          {groupsFiltered.slice(0, 5).map((group) => <p key={group}><Checkbox onChange={(e) => setGroups([...groups, group]) } checked={false}>{group}</Checkbox></p>)}
          {groupsFiltered.length > 5 && <Text i>And {groupsFiltered.length} more...</Text>}
        </Grid>
      </Grid.Container>
    </>
  )
}
