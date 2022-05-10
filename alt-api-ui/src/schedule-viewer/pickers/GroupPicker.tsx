import { faAdd, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Modal, Text } from '@nextui-org/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { GroupDatalist } from '../../datalists/GroupDatalist'
import { baseUrl } from '../../util'
import ky from 'ky'
import UniversalPicker from './UniversalPicker'

type GroupPickerProps = {
  groups: string[]
  setGroups: (value: string[]) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

function shouldDisableButton(input: string, groups: string[]) {
  if (!input) return true
  if (input.length === 0) return true
  if (groups.includes(input)) return true
  return false
}

const getAllGroups = () =>
  ky.get(`${baseUrl}v1/timetable/groups`).json<{ groupsAvailable: string[] }>()

export function ExperimentalGroupPicker({ groups, setGroups, visible, setVisible }: GroupPickerProps) {
  const { data: groupsData } = useQuery('groups', getAllGroups)

  return (
    <UniversalPicker
      values={groups}
      setValues={setGroups}
      visible={visible}
      setVisible={setVisible}
      datalist={groupsData?.groupsAvailable ?? []}
    />
  )
}



export function GroupPicker({ groups, setGroups, visible, setVisible }: GroupPickerProps) {
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const closeHandler = () => {
    setVisible(false)
  }

  const addGroup = () => {
    const input = document.querySelector('#addGroupInput') as HTMLInputElement
    if (!input) return
    if (groups.includes(input.value) || input.value === '') return
    setGroups([...groups, input.value].sort())
  }

  const rmGroup = (groupName: string) => {
    setGroups(groups.filter((g) => g !== groupName))
  }

  return (
    <Modal
      closeButton={groups.length > 0}
      blur
      preventClose
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text>Dodaj grupy</Text>
      </Modal.Header>
      <Modal.Body>
        <GroupDatalist id={'allGroups'} />
        <Input
          id={'addGroupInput'}
          bordered
          label={'Nazwa grupy'}
          placeholder={'WIs I.2 - 1w'}
          list={'allGroups'}
          onChange={({ target }) =>
            setButtonDisabled(shouldDisableButton(target.value, groups))
          }
          onFocus={({ target }) => setButtonDisabled(shouldDisableButton(target.value, groups))}
        />
        <Button
          // bordered
          auto
          id={'addGroupButton'}
          icon={<FontAwesomeIcon icon={faAdd} />}
          disabled={buttonDisabled}
          onClick={addGroup}
        >
          Dodaj
        </Button>
        {groups.map((g, i) => {
          return (
            <p key={i}>
              <Button
                light
                auto
                style={{ display: 'inline-block' }}
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={() => rmGroup(g)}
              />
              <Text span>{g}</Text>
            </p>
          )
        })}
        <Button
          auto
          disabled={groups.length === 0}
          icon={<FontAwesomeIcon icon={faCheck} />}
          color={groups.length > 0 ? 'success' : undefined}
          onClick={() => setVisible(false)}
        >
          Gotowe
        </Button>
      </Modal.Body>
    </Modal>
  )
}
