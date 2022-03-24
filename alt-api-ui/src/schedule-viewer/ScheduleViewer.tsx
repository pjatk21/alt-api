import React, { useState } from 'react'
import { Button, Container, Grid, Input, Modal, Spacer, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'
import { DateTime } from 'luxon'
import { useQueryClient } from 'react-query'
import { useLocalStorage } from 'usehooks-ts'
import './ScheduleViewer.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons'

export function ScheduleViewer() {
  const queryClient = useQueryClient()
  const [activeDate, setActiveDate] = useState(DateTime.now())
  const [groups, setGroups] = useLocalStorage(
    'groups',
    //['WIs I.2 - 1w', 'WIs I.2 - 46c', 'WIs I.2 - 126l'].sort(),
    [] as string[],
  )
  const [groupPickerVisible, setGroupPickerVisible] = useState(groups.length === 0)

  const addGroup = (group: string) => {
    if (groups.includes(group)) return
    setGroups([...groups, group].sort())
    queryClient.invalidateQueries({ queryKey: 'schedule' })
  }
  const removeGroup = (group: string) => {
    setGroups(groups.filter((x) => x !== group))
    queryClient.invalidateQueries({ queryKey: 'schedule' })
  }

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
      <Modal
        closeButton={groups.length > 0}
        blur
        preventClose
        open={groupPickerVisible}
        onClose={() => setGroupPickerVisible(false)}
      >
        <Modal.Header>
          <Text>Add groups</Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            id={'addGroupInput'}
            bordered
            label={'Group name'}
            placeholder={'WIs I.2 - 1w'}
            clearable
          />
          <Button
            bordered
            auto
            onClick={() =>
              addGroup(
                (document.querySelector('#addGroupInput') as HTMLInputElement)!.value,
              )
            }
          >
            Add
          </Button>
          <Text color={'warning'}>If nothing changed, try refreshing page</Text>
          {groups.map((g, i) => {
            return (
              <p key={i}>
                <Button
                  light
                  auto
                  style={{ display: 'inline-block' }}
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  onClick={() => removeGroup(g)}
                />
                <Text span>{g}</Text>
              </p>
            )
          })}
        </Modal.Body>
      </Modal>
      <Spacer />
    </Container>
  )
}
