import React, { useState } from 'react'
import { Button, Container, Grid, Input, Modal, Spacer, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'
import { DateTime } from 'luxon'
import { useQueryClient } from 'react-query'
import { useLocalStorage, useTimeout } from 'usehooks-ts'
import './ScheduleViewer.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import { GroupDatalist } from '../datalists/GroupDatalist'

const urlInit = new URL(window.location.href)
const initalGroups = urlInit.searchParams.getAll('set')
const initalDate = urlInit.searchParams.get('date')
let initFinished = false


export function ScheduleViewer() {
  const queryClient = useQueryClient()

  const [activeDate, setActiveDate] = useState(DateTime.now())
  if (initalDate && !initFinished) setActiveDate(DateTime.fromISO(initalDate))

  const [groups, setGroups] = useLocalStorage<string[]>('groups', [])
  if (initalGroups.length > 0 && !initFinished) {
    setGroups(initalGroups)
    window.location.href = window.location.protocol + window.location.pathname
  }

  const shouldDisableButton = () => {
    const v = (document.querySelector('#addGroupInput') as HTMLInputElement)?.value
    if (!v) return true
    if (v?.length === 0) return true
    if (groups.includes(v)) return true
    return false
  }

  initFinished = true

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
  console.log(groups, activeDate, initalDate)

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
          <GroupDatalist id={'allGroups'} />
          <Input
            id={'addGroupInput'}
            bordered
            label={'Group name'}
            placeholder={'WIs I.2 - 1w'}
            list={'allGroups'}
            clearable
          />
          <Button
            bordered
            auto
            id={'addGroupButton'}
            icon={<FontAwesomeIcon icon={faAdd} />}
            disabled={shouldDisableButton()}
            onClick={() =>
              addGroup(
                (document.querySelector('#addGroupInput') as HTMLInputElement)!.value,
              )
            }
          >
            Add
          </Button>
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
