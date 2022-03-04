import React from "react"
import { Button, Container, Link, NextUIProvider, Text } from "@nextui-org/react"
import { Link as RouterLink } from "react-router-dom"

export function NotFound() {
  return (
    <NextUIProvider>
        <Container sm>
            <Text h1 css={{
                textGradient: 'to right, #217ECF 0%, #A8DFFF 100%'
            }}>404</Text>
            <RouterLink to="/">
                <Button auto>Go back home</Button>
            </RouterLink>
        </Container>
    </NextUIProvider>
  )
}