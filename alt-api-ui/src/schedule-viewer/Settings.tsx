import React from 'react'
import { Grid, Modal, Switch } from '@nextui-org/react'
import { useLocalStorage } from 'usehooks-ts'

type SettingsOptions = Partial<{
  allowPrefetch: boolean
  experimentalCache: boolean
}>

type SettingsProps = {
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

type SettingsSwitchProps = {
  settingsKey: keyof SettingsOptions
  description: string
  experimental?: boolean
}

export function Settings({ visible, setVisible }: SettingsProps) {
  const [settingsStore, setSettingsStore] = useLocalStorage<SettingsOptions>(
    'settings',
    {},
  )

  const closeHandler = () => {
    setVisible(false)
    setSettingsStore(settingsStore)
  }

  function SettingsSwitch({
    settingsKey,
    description,
    experimental,
  }: SettingsSwitchProps) {
    return (
      <Grid.Container gap={1} alignItems={'center'}>
        <Grid>
          <Switch
            color={experimental ? 'warning' : 'default'}
            checked={settingsStore[settingsKey]}
            onChange={(e) => (settingsStore[settingsKey] = e.target.checked)}
          />
        </Grid>
        <Grid>
          <span style={{ display: 'block' }}>
            {experimental && '(Experimental) '}
            {description}
          </span>
        </Grid>
      </Grid.Container>
    )
  }

  return (
    <Modal open={visible} onClose={closeHandler} closeButton>
      <Modal.Header>
        <p>Settings</p>
      </Modal.Header>
      <Modal.Body>
        <SettingsSwitch settingsKey={'allowPrefetch'} description={'Prefetch schedule'} />
      </Modal.Body>
    </Modal>
  )
}
