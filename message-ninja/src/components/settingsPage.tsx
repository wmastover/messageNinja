import React, { useState, ChangeEvent, FormEvent } from 'react';
import { storeVariableMessage} from '../types';
import { sendMessageToBackgroundScript } from '../functions/sendMessageToBackgroundScript';

interface settingsPageProps {
    changeSettings: (arg0: boolean) => void,
    setAPIKey: (arg0: string) => void
    getMessage: (arg0: string) => void
}

export const SettingsPage = (props: settingsPageProps) => {

    const [inputValue, setInputValue] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
    };

    
    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('Submitted value:', inputValue);

    const toSend: storeVariableMessage = {
        type: "storeVariable",
        key: "APIKey",
        value: inputValue,

    }
    sendMessageToBackgroundScript(toSend)
    props.setAPIKey(inputValue)
    props.getMessage(inputValue)
    props.changeSettings(true)
    setInputValue('');
    };



    return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="inputBox">
        Enter API Key:
        <input
            type="text"
            id="inputBox"
            value={inputValue}
            onChange={handleChange}
        />
        </label>
        <button type="submit">Submit</button>
    </form>
    );
}
    