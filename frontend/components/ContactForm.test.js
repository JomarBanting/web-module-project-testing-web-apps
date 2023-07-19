import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>);
});

test('renders the contact form header', () => {
    render(<ContactForm/>);

    const headerElement = screen.queryByText(/Contact Form/i);
    
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameField = document.querySelector(`input[name='firstName']`);
    userEvent.type(firstNameField, "123");

    const errorMessages =  await screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
    
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameField = document.querySelector(`input[name='firstName']`);
    userEvent.type(firstNameField, "Jomar");
    
    const lastNameField = document.querySelector(`input[name="lastName"]`);
    userEvent.type(lastNameField, "Banting");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId("error");
        expect(errorMessage).toHaveLength(1);
    });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const emailField = document.querySelector(`input[name="email"]`);
    userEvent.type(emailField, "123");

    const errorMessage = await screen.findByText(/email must be a valid email address/);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const firstNameField = document.querySelector(`input[name='firstName']`);
    userEvent.type(firstNameField, "Jomar");

    const emailField = document.querySelector(`input[name="email"]`);
    userEvent.type(emailField, "jomarbanting@gmail.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessage = screen.getByText(/lastName is a required field/);
        expect(errorMessage).toBeInTheDocument();
    });
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstNameField = document.querySelector(`input[name="firstName"]`);
    userEvent.type(firstNameField, "Jomar");

    const lastnameField = document.querySelector(`input[name="lastName"]`);
    userEvent.type(lastnameField, "Banting");

    const emailField = document.querySelector(`input[name="email"]`);
    userEvent.type(emailField, "jomarbanting@gmail.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByTestId("firstnameDisplay");
        const lastNameDisplay = screen.queryByTestId("lastnameDisplay");
        const emailDisplay = screen.queryByTestId("emailDisplay");
        const messageDisplay = screen.queryByTestId("messageDisplay");
        
        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstNameField = document.querySelector(`input[name="firstName"]`);
    const lastNameField = document.querySelector(`input[name="lastName"]`);
    const emailField = document.querySelector(`input[name="email"]`);
    const messageField = document.querySelector(`input[name="message"]`);

    userEvent.type(firstNameField, "Jomar");
    userEvent.type(lastNameField, "Banting");
    userEvent.type(emailField, "JomarBanting@email.com");
    userEvent.type(messageField, "Happy Birth Day!");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.getByTestId("firstnameDisplay");
        const lastNameDisplay = screen.getByTestId("lastnameDisplay");
        const emailDisplay = screen.getByTestId("emailDisplay");
        const messageDisplay = screen.getByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});
