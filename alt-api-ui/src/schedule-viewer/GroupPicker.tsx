import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Modal, Text } from '@nextui-org/react'
import React, { useState } from 'react'
import { GroupDatalist } from '../datalists/GroupDatalist'

type GroupPickerProps = {
  groups: string[]
  setGroups: (value: React.SetStateAction<string[]>) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

function shouldDisableButton(input: string, groups: string[]) {
  if (!input) return true
  if (input.length === 0) return true
  if (groups.includes(input)) return true
  return false
}

export function GroupPicker({
  groups,
  setGroups,
  visible,
  setVisible,
}: GroupPickerProps) {
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
        <Text>Add groups</Text>
      </Modal.Header>
      <Modal.Body>
        {buttonDisabled && (
          <Text color={'warning'}>Group name is required or group is already added!</Text>
        )}
        <GroupDatalist id={'allGroups'} />
        <Input
          id={'addGroupInput'}
          bordered
          label={'Group name'}
          placeholder={'WIs I.2 - 1w'}
          list={'allGroups'}
          onChange={({ target }) =>
            setButtonDisabled(shouldDisableButton(target.value, groups))
          }
          onFocus={({ target }) =>
            setButtonDisabled(shouldDisableButton(target.value, groups))
          }
        />
        <Button
          // bordered
          auto
          id={'addGroupButton'}
          icon={<FontAwesomeIcon icon={faAdd} />}
          disabled={buttonDisabled}
          onClick={addGroup}
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
                onClick={() => rmGroup(g)}
              />
              <Text span>{g}</Text>
            </p>
          )
        })}
      </Modal.Body>
    </Modal>
  )
}