import {fireEvent, render, screen} from '@testing-library/react'
import Authentication from './Authentication'
import {Provider} from 'react-redux'
import {store} from '@/store/store'
import {describe, expect, test} from "vitest";

describe('Authentication', () => {
    test('renders login form by default', () => {
        render(
            <Provider store={store}>
                <Authentication/>
            </Provider>
        )

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument()
    })

    test('switches to register form when toggle is clicked', () => {
        render(
            <Provider store={store}>
                <Authentication/>
            </Provider>
        )

        fireEvent.click(screen.getByText(/don't have an account/i))

        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
        expect(screen.getByRole('button', {name: /create account/i})).toBeInTheDocument()
    })
})
