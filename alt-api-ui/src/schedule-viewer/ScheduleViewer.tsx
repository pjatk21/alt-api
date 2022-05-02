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
import { useNavigate, useParams } from 'react-router-dom'
import { Disclaimer } from './Disclaimer'
import { Settings } from './Settings'
import { Link } from 'react-router-dom'

type DateNaviButtonProps = {
  icon: IconDefinition
}

function DateNaviButton({ icon }: DateNaviButtonProps) {
  return <Button bordered auto icon={<FontAwesomeIcon icon={icon} />} />
}

type DateNavigatorProps = {
  date: DateTime
  // setDate: React.Dispatch<React.SetStateAction<DateTime>>
}

export function DateNavigator({ date }: DateNavigatorProps) {
  const navi = useNavigate()

  return (
    <Grid.Container gap={1} justify={'center'}>
      <Grid>
        <Link to={'/app/' + date.minus({ day: 1 }).toISODate()}>
          <DateNaviButton icon={faArrowLeft} />
        </Link>
      </Grid>
      <Grid>
        <Input
          bordered
          type={'date'}
          onChange={(e) => navi('/app/' + e.target.value)}
          value={date.toISODate()}
        />
      </Grid>
      <Grid>
        <Link to={'/app/' + date.plus({ day: 1 }).toISODate()}>
          <DateNaviButton icon={faArrowRight} />
        </Link>
      </Grid>
    </Grid.Container>
  )
}

export function ScheduleViewer() {
  const params = useParams()
  const navi = useNavigate()
  const activeDate = params.date ? DateTime.fromISO(params.date) : DateTime.now()
  if (!params.date && activeDate.isValid) navi('/app/' + activeDate.toISODate())
  if (params.date) if (!DateTime.fromISO(params.date).isValid) navi('/app/')
  console.log(params)

  const [groups, setGroups] = useLocalStorage<string[]>('groups', [])
  const [groupPickerVisible, setGroupPickerVisible] = useState(groups.length === 0)
  const [settingsVisible, setSettingsVisible] = useState(false)

  return (
    <Container xs>
      <Text h2>Plan zajęć</Text>
      <DateNavigator date={activeDate} />
      <Text style={{ textAlign: 'center' }}>
        {activeDate.toLocaleString({ weekday: 'long' })}
      </Text>
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
