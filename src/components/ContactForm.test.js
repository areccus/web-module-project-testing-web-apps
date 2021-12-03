import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>)
    const header = screen.queryByText(/Contact Form/i)

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/Contact Form/i)

});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)

    const first = screen.getByLabelText(/First Name*/i)
    userEvent.type(first, 'no')

    const lengthError = await screen.findAllByTestId('error')
    expect(lengthError).toHaveLength(1)
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId('error')
        expect(errorMessages).toHaveLength(3)
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)

    const first = screen.getByLabelText(/First Name*/i)
    userEvent.type(first, 'Itachi')

    const last = screen.getByLabelText(/Last Name*/i)
    userEvent.type(last, 'Uchiha')

    const button = screen.getByRole('button')
    userEvent.click(button)
    
    const error = await screen.getAllByTestId('error')
    expect(error).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)

    const email = screen.getByLabelText(/email*/i)
    userEvent.type(email, 'believeit@')

    const error = await screen.findByText(/email must be a valid email address/i)
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)

    const button = screen.getByRole('button')
    userEvent.click(button)

    const error = await screen.findByText(/lastName is a required/i)
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)
    const first = screen.getByLabelText(/First Name*/i)
    userEvent.type(first, 'Itachi')
    const last = screen.getByLabelText(/Last Name*/i)
    userEvent.type(last, 'Uchiha')
    const email = screen.getByLabelText(/email*/i)
    userEvent.type(email, 'believeit@konoha.com')
    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('Itachi')
        const lastNameDisplay = screen.queryByText('Uchiha')
        const emailDisplay = screen.queryByText('believeit@konoha.com')
        const messageDisplay = screen.queryByTestId('messageDisplay')

        expect(firstNameDisplay).toBeInTheDocument()
        expect(lastNameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).not.toBeInTheDocument()
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)
    const first = screen.getByLabelText(/First Name*/i)
    userEvent.type(first, 'Itachi')
    const last = screen.getByLabelText(/Last Name*/i)
    userEvent.type(last, 'Uchiha')
    const email = screen.getByLabelText(/Email*/i)
    userEvent.type(email, 'believeit@konoha.com')
    const message = screen.getByLabelText(/Message/i)
    userEvent.type(message, 'messages')
    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('Itachi')
        const lastNameDisplay = screen.queryByText('Uchiha')
        const emailDisplay = screen.queryByText('believeit@konoha.com')
        const messageDisplay = screen.queryByTestId(/message/i)

        expect(firstNameDisplay).toBeInTheDocument()
        expect(lastNameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).toBeInTheDocument()
    })


});