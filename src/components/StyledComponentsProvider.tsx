'use client'

import React from 'react'
import { StyleSheetManager, ThemeProvider } from 'styled-components'

export default function StyledComponentsProvider({ children }: { children: React.ReactNode }) {
    return (
        <StyleSheetManager shouldForwardProp={(prop) => prop !== 'imageUrl'}>
            <ThemeProvider theme={{}}>
                {children}
            </ThemeProvider>
        </StyleSheetManager>
    )
}