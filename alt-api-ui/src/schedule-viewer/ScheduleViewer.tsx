import React, { useState } from 'react'
import { Button, Container, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'
import { DateTime } from 'luxon'
import { useLocalStorage } from 'usehooks-ts'
import './ScheduleViewer.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { Settings } from './Settings'
import { GroupPicker } from './GroupPicker'

type DateNaviButtonProps = {
  icon: IconDefinition
  onClick: () => void
}

function DateNaviButton({ icon, onClick }: DateNaviButtonProps) {
  return <Button bordered auto onClick={onClick} icon={<FontAwesomeIcon icon={icon} />} />
}

type DateNavigatorProps = {
  date: DateTime
  setDate: React.Dispatch<React.SetStateAction<DateTime>>
}

export function DateNavigator({ date, setDate }: DateNavigatorProps) {
  return (
    <Grid.Container gap={1} justify={'center'}>
      <Grid>
        <DateNaviButton
          onClick={() => setDate(date.minus({ day: 1 }))}
          icon={faArrowLeft}
        />
      </Grid>
      <Grid>
        <Input
          bordered
          type={'date'}
          onChange={(e) => setDate(DateTime.fromISO(e.target.value))}
          value={date.toISODate()}
        />
      </Grid>
      <Grid>
        <DateNaviButton
          onClick={() => setDate(date.plus({ day: 1 }))}
          icon={faArrowRight}
        />
      </Grid>
    </Grid.Container>
  )
}

export function ScheduleViewer() {
  const [activeDate, setActiveDate] = useState(DateTime.now())
  const [groups, setGroups] = useLocalStorage<string[]>('groups', [])
  const [groupPickerVisible, setGroupPickerVisible] = useState(groups.length === 0)
  const [settingsVisible, setSettingsVisible] = useState(false)

  return (
    <Container xs>
      <Text h2>Plan zajęć</Text>
      <DateNavigator date={activeDate} setDate={setActiveDate} />
      <ScheduleTimeline date={activeDate} groups={groups} />
      <Spacer />
      <Button auto bordered onClick={() => setGroupPickerVisible(true)}>
        Change groups
      </Button>
      <GroupPicker
        groups={groups}
        setGroups={setGroups}
        visible={groupPickerVisible}
        setVisible={setGroupPickerVisible}
      />
      <Spacer />
      <Button auto bordered onClick={() => setSettingsVisible(true)}>
        Settings
      </Button>
      <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
    </Container>
  )
}
