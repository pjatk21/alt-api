import React from 'react'
import { Grid, Link, Modal, Switch } from '@nextui-org/react'
import { useLocalStorage } from 'usehooks-ts'

export type SettingsOptions = Partial<{
  disableSentry: boolean
  olaMode: boolean // everyone need some positivity in theirs live
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
  const [settingsStore, setSettingsStore] = useLocalStorage<SettingsOptions>('settings', {})

  const closeHandler = () => {
    setVisible(false)
    setSettingsStore(settingsStore)
  }

  function SettingsSwitch({ settingsKey, description, experimental }: SettingsSwitchProps) {
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
    <Modal preventClose open={visible} onClose={closeHandler} closeButton>
      <Modal.Header>
        <p>Ustawienia</p>
      </Modal.Header>
      <Modal.Body>
        <h4>Prywatność</h4>
        <SettingsSwitch settingsKey={'disableSentry'} description={'Wyłącz Sentry SDK'} />
        <h4>✨Specials✨</h4>
        <SettingsSwitch settingsKey={'olaMode'} description={'✨Ola mode✨'} />
        <h4>Pomoc</h4>
        <Link href={'https://github.com/pjatk21/alt-api/wiki/Install-PWA'}>
          Jak zainstalować aplikację PWA
        </Link>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  )
}
