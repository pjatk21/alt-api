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
  faCogs,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { GroupPicker } from './GroupPicker'
import { useLocation } from 'react-router-dom'
import { Disclaimer } from './Disclaimer'
import { Settings } from './Settings'

type DateNaviButtonProps = {
  icon: IconDefinition
  onClick?: () => void
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

function useQueryArgs() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

export function ScheduleViewer() {
  const queryArgs = useQueryArgs()
  const initalDate = DateTime.fromISO(queryArgs.get('date') ?? '')
  const [activeDate, setActiveDate] = useState(
    initalDate.isValid ? initalDate : DateTime.now(),
  )
  const [groups, setGroups] = useLocalStorage<string[]>('groups', [])
  const [groupPickerVisible, setGroupPickerVisible] = useState(groups.length === 0)
  const [tutors, setTutors] = useLocalStorage<string[]>('tutors', [])
  const [tutorPickerVisible, setTutorPickerVisible] = useState(tutors.length === 0)
  const [settingsVisible, setSettingsVisible] = useState(false)

  return (
    <Container xs>
      <Text h2>Plan zajęć</Text>
      <DateNavigator date={activeDate} setDate={setActiveDate} />
      <ScheduleTimeline date={activeDate} groups={groups} />
      <Spacer />
      <Button.Group bordered>
        <Button auto onClick={() => setGroupPickerVisible(true)}>
          Zmień grupy
        </Button>
        <Button
          auto
          onClick={() => setSettingsVisible(true)}
          icon={<FontAwesomeIcon icon={faCogs} />}
        />
      </Button.Group>
      <Spacer />
      <GroupPicker
        groups={groups}
        setGroups={setGroups}
        visible={groupPickerVisible}
        setVisible={setGroupPickerVisible}
      />
      <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
      <Disclaimer />
    </Container>
  )
}
