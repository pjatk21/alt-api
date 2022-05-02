import { Button, Loading, Modal, Text } from '@nextui-org/react'
import { useState } from 'react'
import { useLocalStorage, useTimeout } from 'usehooks-ts'
import disclaimer from './disclaimer.txt?raw'

export function Disclaimer() {
  const [accepted, setAccepted] = useLocalStorage('disclaimerAcknowledged', false)
  const [allowAccept, setAllowAccept] = useState(false)

  useTimeout(() => setAllowAccept(true), 5000)

  return (
    <Modal style={{ height: '80vh' }} blur preventClose open={!accepted}>
      <Modal.Header>
        <Text h2 color={'error'}>
          Disclaimer
        </Text>
      </Modal.Header>
      <Modal.Body>
        <p style={{ whiteSpace: 'pre-line', fontFamily: 'JetBrains Mono' }}>
          {disclaimer}
        </p>
      </Modal.Body>
      <Modal.Footer>
        {allowAccept ? (
          <Button color={'error'} onClick={() => setAccepted(true)}>
            Akceptuje to ryzyko.
          </Button>
        ) : (
          <Button disabled>
            <Loading color={'white'} type={'points-opacity'} />
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}
