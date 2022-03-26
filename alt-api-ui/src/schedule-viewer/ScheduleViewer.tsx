import React, { useState } from 'react'
import { Button, Container, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'
import { DateTime } from 'luxon'
import { useQueryClient } from 'react-query'
import { useLocalStorage } from 'usehooks-ts'
import './ScheduleViewer.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Settings } from './Settings'
import { GroupPicker } from './GroupPicker'

export function ScheduleViewer() {
  const queryClient = useQueryClient()
  const [activeDate, setActiveDate] = useState(DateTime.now())
  const [groups, setGroups] = useLocalStorage<string[]>('groups', [])
  const [groupPickerVisible, setGroupPickerVisible] = useState(groups.length === 0)
  const [settingsVisible, setSettingsVisible] = useState(false)

  return (
    <Container xs>
      <Text h2>Plan zajęć</Text>
      <Grid.Container gap={1} justify={'center'}>
        <Grid>
          <Button
            bordered
            auto
            onClick={() => setActiveDate(activeDate.minus({ day: 1 }))}
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
          />
        </Grid>
        <Grid>
          <Input
            bordered
            type={'date'}
            onChange={(e) => {
              setActiveDate(DateTime.fromISO(e.target.value))
              queryClient.invalidateQueries({ queryKey: 'schedule' })
            }}
            value={activeDate.toISODate()}
          />
        </Grid>
        <Grid>
          <Button
            bordered
            auto
            onClick={() => setActiveDate(activeDate.plus({ day: 1 }))}
            icon={<FontAwesomeIcon icon={faArrowRight} />}
          />
        </Grid>
      </Grid.Container>
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
